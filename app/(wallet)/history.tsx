/**
 * SynKrew — Transaction History + Transaction Detail Sheet
 * Route: app/(wallet)/history.tsx
 *
 * Three list states:
 *   'list'     : Populated transaction rows
 *   'empty'    : No transactions yet
 *   'filtered' : Filter applied, no matches
 *
 * Transaction Detail: rendered as an in-page modal/sheet (not a separate route).
 * Win Share transaction type is visually distinct from generic "stake returned."
 *
 * Key from §2.9:
 *   - "stake locked" rows show coin amount + % basis (e.g. "Staked 72 (60% of 120)")
 *   - Win Share has its own type with causal copy (who forfeited → I received)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  C, S, T,
  BORDER, BORDER_THIN, SHADOW_OFFSET, SHADOW_OFFSET_SM,
  hardShadow, gridBgStyle,
} from '../../theme/tokens';
import { EmptyState } from '../../components/ui/EmptyState';

// ─── Types ────────────────────────────────────────────────────────────────────
export type TxType =
  | 'stake_locked'
  | 'stake_returned'
  | 'stake_forfeited'
  | 'win_share'      // Visually distinct — distinct from stake_returned per §2.9
  | 'milestone_bonus'
  | 'penalty';

export type TxStatus = 'settled' | 'pending';

export type ListState = 'list' | 'empty' | 'filtered';

interface Transaction {
  id: string;
  type: TxType;
  amount: number;       // positive = received, negative = lost
  status: TxStatus;
  groupName: string;
  taskName?: string;
  timestamp: string;
  dateLabel: string;
  stakeBasis?: {        // only for stake_locked/returned/forfeited
    percent: number;
    balanceBefore: number;
  };
  winShareFrom?: {      // only for win_share — causal attribution
    memberCount: number;
  };
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_001',
    type: 'win_share',
    amount: 24,
    status: 'settled',
    groupName: 'Morning Runners',
    taskName: '5K Run',
    timestamp: '2026-08-27 11:58 PM',
    dateLabel: 'Yesterday',
    winShareFrom: { memberCount: 1 },
  },
  {
    id: 'tx_002',
    type: 'stake_returned',
    amount: 72,
    status: 'settled',
    groupName: 'Morning Runners',
    taskName: '5K Run',
    timestamp: '2026-08-27 11:58 PM',
    dateLabel: 'Yesterday',
    stakeBasis: { percent: 60, balanceBefore: 120 },
  },
  {
    id: 'tx_003',
    type: 'stake_locked',
    amount: -72,
    status: 'pending',
    groupName: 'Morning Runners',
    taskName: '5K Run',
    timestamp: '2026-08-28 12:00 AM',
    dateLabel: 'Today',
    stakeBasis: { percent: 60, balanceBefore: 120 },
  },
  {
    id: 'tx_004',
    type: 'milestone_bonus',
    amount: 50,
    status: 'settled',
    groupName: 'Morning Runners',
    timestamp: '2026-08-26 11:58 PM',
    dateLabel: 'Aug 26',
  },
  {
    id: 'tx_005',
    type: 'stake_forfeited',
    amount: -48,
    status: 'settled',
    groupName: 'Code Grind',
    taskName: 'LeetCode Daily',
    timestamp: '2026-08-25 11:59 PM',
    dateLabel: 'Aug 25',
    stakeBasis: { percent: 60, balanceBefore: 80 },
  },
  {
    id: 'tx_006',
    type: 'stake_returned',
    amount: 48,
    status: 'settled',
    groupName: 'Code Grind',
    taskName: 'LeetCode Daily',
    timestamp: '2026-08-24 11:58 PM',
    dateLabel: 'Aug 24',
    stakeBasis: { percent: 60, balanceBefore: 80 },
  },
];

// ─── TX config — visual grammar for each type ─────────────────────────────────
const TX_CONFIG: Record<TxType, {
  label: string;
  icon: string;
  bg: string;
  textColor: string;
  amountColor: string;
}> = {
  stake_locked: {
    label: 'STAKE LOCKED',
    icon: '🔒',
    bg: C.yellow,
    textColor: C.black,
    amountColor: '#7a135d',
  },
  stake_returned: {
    label: 'STAKE RETURNED',
    icon: '✓',
    bg: C.secondaryContainer,
    textColor: '#006c4e',
    amountColor: '#006c4e',
  },
  stake_forfeited: {
    label: 'STAKE FORFEITED',
    icon: '✕',
    bg: C.errorContainer,
    textColor: C.onErrorContainer,
    amountColor: C.error,
  },
  win_share: {
    // Distinct type — not folded into stake_returned per §2.9
    label: 'WIN SHARE',
    icon: '⚡',
    bg: C.cyan,
    textColor: '#004a4a',
    amountColor: '#006c4e',
  },
  milestone_bonus: {
    label: 'MILESTONE BONUS',
    icon: '🏆',
    bg: C.pink,
    textColor: C.black,
    amountColor: '#006c4e',
  },
  penalty: {
    label: 'PENALTY',
    icon: '⚠',
    bg: C.errorContainer,
    textColor: C.onErrorContainer,
    amountColor: C.error,
  },
};

// ─── Filter groups ─────────────────────────────────────────────────────────────
const FILTER_GROUPS = ['All Groups', 'Morning Runners', 'Code Grind'];

import { useTransactionHistoryQuery } from '../../hooks/queries/useWallet';

export default function TransactionHistoryScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);

  const { data: historyData } = useTransactionHistoryQuery();

  const [listState, setListState] = useState<ListState>('list');
  const [activeFilter, setActiveFilter] = useState('All Groups');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const rawTxList: Transaction[] = historyData?.transactions && historyData.transactions.length > 0
    ? historyData.transactions.map(t => ({
        id: t.id,
        type: t.type as TxType,
        amount: t.amount,
        status: t.settlementStatus as TxStatus,
        groupName: t.groupName || 'Neon Runners',
        taskName: t.description,
        timestamp: t.createdAt,
        dateLabel: 'Today',
        stakeBasis: { percent: 60, balanceBefore: 120 },
        winShareFrom: t.type === 'win_share' ? { memberCount: 1 } : undefined,
      }))
    : MOCK_TRANSACTIONS;

  const transactions = listState === 'empty'
    ? []
    : activeFilter === 'All Groups'
    ? rawTxList
    : rawTxList.filter(tx => tx.groupName === activeFilter);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={[styles.topBarInner, { maxWidth: cardWidth + S.md * 2 }]}>
          <Pressable
            testID="history-btn-back"
            style={[styles.backBtn, hardShadow(SHADOW_OFFSET_SM)]}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Back to wallet"
          >
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.topBarTitle}>LEDGER.EXE</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {/* State demo bar */}
      <View style={styles.demoBar}>
        <Text style={styles.demoBarLabel}>STATE:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: S.unit }}>
          {(['list', 'empty', 'filtered'] as ListState[]).map(s => (
            <Pressable
              key={s}
              style={[styles.demoChip, listState === s && styles.demoChipActive]}
              onPress={() => setListState(s)}
            >
              <Text style={[styles.demoChipText, listState === s && styles.demoChipTextActive]}>
                {s}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Filter chips — by group */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: S.xs, paddingHorizontal: S.md }}>
          {FILTER_GROUPS.map(grp => (
            <Pressable
              key={grp}
              testID={`history-filter-${grp}`}
              style={[
                styles.filterChip,
                activeFilter === grp && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(grp)}
            >
              <Text style={[
                styles.filterChipText,
                activeFilter === grp && styles.filterChipTextActive,
              ]}>
                {grp.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: S.xxl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: cardWidth, alignSelf: 'center', gap: S.sm }}>

          {/* ═══ EMPTY STATE ═══ */}
          {listState === 'empty' && (
            <EmptyState
              windowTitle="LEDGER.EXE"
              titleBarColor="lavender"
              icon="📋"
              headline="NO TRANSACTIONS YET"
              description="Your ledger is empty. Transactions appear here after your first daily stake locks at midnight."
              testID="history-empty-state"
            />
          )}

          {/* ═══ FILTER NO RESULTS ═══ */}
          {listState === 'filtered' && (
            <EmptyState
              windowTitle="LEDGER.EXE"
              titleBarColor="lavender"
              icon="🔍"
              headline="NO RESULTS"
              description="No transactions match the current filter. Try a different group or clear the filter."
              actionLabel="CLEAR FILTER"
              onAction={() => setActiveFilter('All Groups')}
              testID="history-filtered-empty-state"
            />
          )}

          {/* ═══ TRANSACTION LIST ═══ */}
          {listState === 'list' && (
            <>
              {transactions.map((tx) => {
                const cfg = TX_CONFIG[tx.type];
                return (
                  <Pressable
                    key={tx.id}
                    testID={`tx-row-${tx.id}`}
                    style={[
                      styles.txRow,
                      hardShadow(SHADOW_OFFSET_SM),
                      tx.type === 'win_share' && styles.txRowWinShare,
                    ]}
                    onPress={() => setSelectedTx(tx)}
                    accessibilityRole="button"
                    accessibilityLabel={`${cfg.label} ${tx.amount > 0 ? '+' : ''}${tx.amount}`}
                  >
                    {/* Type icon frame */}
                    <View style={[styles.txIconFrame, { backgroundColor: cfg.bg }]}>
                      <Text style={styles.txIcon}>{cfg.icon}</Text>
                    </View>

                    {/* Content */}
                    <View style={{ flex: 1, gap: 2 }}>
                      <View style={styles.txTopRow}>
                        <View style={[styles.txTypeBadge, { backgroundColor: cfg.bg }]}>
                          <Text style={[styles.txTypeBadgeText, { color: cfg.textColor }]}>
                            {cfg.label}
                          </Text>
                        </View>
                        {tx.status === 'pending' && (
                          <View style={styles.pendingBadge}>
                            <Text style={styles.pendingBadgeText}>PENDING</Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.txGroupName}>{tx.groupName}</Text>

                      {/* Stake basis label — required per §2.9 */}
                      {tx.stakeBasis && (
                        <Text style={styles.txBasisLabel}>
                          {Math.abs(tx.amount)} ({tx.stakeBasis.percent}% of {tx.stakeBasis.balanceBefore})
                        </Text>
                      )}

                      {/* Win Share causal copy — distinct from stake_returned */}
                      {tx.winShareFrom && (
                        <Text style={styles.txWinShareCopy}>
                          From {tx.winShareFrom.memberCount} member's forfeited stake
                        </Text>
                      )}

                      <Text style={styles.txDate}>{tx.dateLabel} · {tx.timestamp.split(' ').slice(1).join(' ')}</Text>
                    </View>

                    {/* Amount */}
                    <Text style={[styles.txAmount, { color: cfg.amountColor }]}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount}
                    </Text>
                  </Pressable>
                );
              })}
            </>
          )}
        </View>
      </ScrollView>

      {/* ═══ TRANSACTION DETAIL SHEET (modal) ═══ */}
      <Modal
        visible={selectedTx !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTx(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setSelectedTx(null)}
        >
          <Pressable
            style={[styles.detailSheet, hardShadow(SHADOW_OFFSET)]}
            onPress={() => {}}
            accessibilityViewIsModal
          >
            {selectedTx && <TransactionDetailContent tx={selectedTx} onClose={() => setSelectedTx(null)} />}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Transaction Detail Content ───────────────────────────────────────────────
function TransactionDetailContent({ tx, onClose }: { tx: Transaction; onClose: () => void }) {
  const cfg = TX_CONFIG[tx.type];

  return (
    <>
      {/* Sheet title bar */}
      <View style={[detailStyles.titleBar, { backgroundColor: cfg.bg }]}>
        <View style={detailStyles.dots}>
          <View style={[detailStyles.dot, { backgroundColor: C.pink }]} />
          <View style={[detailStyles.dot, { backgroundColor: C.white }]} />
          <View style={[detailStyles.dot, { backgroundColor: C.mint }]} />
        </View>
        <Text style={detailStyles.titleBarLabel}>TX_DETAIL.EXE</Text>
        <Pressable
          testID="tx-detail-close"
          style={detailStyles.closeBtn}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close detail"
        >
          <Text style={detailStyles.closeBtnText}>✕</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={detailStyles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* Amount hero */}
        <View style={detailStyles.amountBlock}>
          <Text style={detailStyles.amountLabel}>{cfg.icon} {cfg.label}</Text>
          <Text style={[detailStyles.amountValue, { color: cfg.amountColor }]}>
            {tx.amount > 0 ? '+' : ''}{tx.amount} COINS
          </Text>
          {/* Stake basis — required display per §2.9 */}
          {tx.stakeBasis && (
            <Text style={detailStyles.amountBasis}>
              {Math.abs(tx.amount)} ({tx.stakeBasis.percent}% of {tx.stakeBasis.balanceBefore})
            </Text>
          )}
        </View>

        {/* Win Share causal block — visually distinct */}
        {tx.winShareFrom && (
          <View style={detailStyles.winShareBlock}>
            <Text style={detailStyles.winShareTitle}>WIN SHARE BREAKDOWN</Text>
            <Text style={detailStyles.winShareBody}>
              +{tx.amount} COINS from {tx.winShareFrom.memberCount} member's forfeited stake.
            </Text>
            <Text style={detailStyles.winShareNote}>
              You received this because you passed today's task while another member forfeited their stake. Win shares are split evenly among that day's passers.
            </Text>
          </View>
        )}

        {/* Detail rows */}
        <View style={detailStyles.detailRows}>
          <DetailRow label="TYPE" value={cfg.label} />
          <DetailRow label="STATUS" value={tx.status.toUpperCase()} badge={tx.status === 'pending'} />
          <DetailRow label="GROUP" value={tx.groupName} />
          {tx.taskName && <DetailRow label="TASK" value={tx.taskName} />}
          <DetailRow label="TIMESTAMP" value={tx.timestamp} mono />
          {tx.stakeBasis && (
            <DetailRow
              label="STAKE BASIS"
              value={`${tx.stakeBasis.percent}% of ${tx.stakeBasis.balanceBefore} balance`}
            />
          )}
        </View>

        {/* Settlement status */}
        <View style={[detailStyles.statusBlock, {
          backgroundColor: tx.status === 'pending' ? C.yellow : C.secondaryContainer,
        }]}>
          <Text style={detailStyles.statusBlockText}>
            {tx.status === 'pending'
              ? '⏳ SETTLEMENT PENDING — balance not yet updated'
              : '✓ SETTLED — balance updated'}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

function DetailRow({
  label, value, mono, badge,
}: { label: string; value: string; mono?: boolean; badge?: boolean }) {
  return (
    <View style={detailStyles.detailRow}>
      <Text style={detailStyles.detailRowLabel}>{label}</Text>
      {badge ? (
        <View style={detailStyles.pendingBadge}>
          <Text style={detailStyles.pendingBadgeText}>{value}</Text>
        </View>
      ) : (
        <Text style={[detailStyles.detailRowValue, mono && detailStyles.detailRowMono]}>
          {value}
        </Text>
      )}
    </View>
  );
}

const detailStyles = StyleSheet.create({
  titleBar: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.xs,
    borderBottomWidth: BORDER,
    borderBottomColor: C.black,
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: {
    width: 12, height: 12, borderRadius: 6,
    borderWidth: BORDER_THIN, borderColor: C.black,
  },
  titleBarLabel: {
    ...T.labelSm,
    color: C.black,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  closeBtn: {
    width: 28,
    height: 28,
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
  },
  body: {
    padding: S.lg,
    gap: S.md,
  },
  amountBlock: {
    alignItems: 'center',
    gap: S.xs,
    paddingBottom: S.md,
    borderBottomWidth: BORDER_THIN,
    borderBottomColor: C.black,
  },
  amountLabel: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  amountValue: {
    ...T.headlineMd,
    fontSize: 32,
  },
  amountBasis: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
    marginTop: 2,
  },
  // Win Share — visually distinct block
  winShareBlock: {
    backgroundColor: C.tertiaryContainer,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    gap: S.xs,
  },
  winShareTitle: {
    ...T.labelSm,
    color: '#004a4a',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  winShareBody: {
    ...T.label,
    color: '#004a4a',
    fontWeight: '800',
  },
  winShareNote: {
    ...T.bodyMd,
    fontSize: 13,
    color: '#004a4a',
    lineHeight: 18,
  },
  detailRows: {
    gap: 0,
    borderWidth: BORDER,
    borderColor: C.black,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: S.xs,
    paddingHorizontal: S.md,
    borderBottomWidth: BORDER_THIN,
    borderBottomColor: C.surfaceContainerHigh,
  },
  detailRowLabel: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  detailRowValue: {
    ...T.label,
    color: C.onSurface,
    fontSize: 13,
    textAlign: 'right',
    flex: 1,
    marginLeft: S.sm,
  },
  detailRowMono: {
    fontFamily: 'JetBrainsMono',
    fontSize: 11,
  },
  pendingBadge: {
    backgroundColor: C.yellow,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pendingBadgeText: {
    ...T.labelXs,
    color: C.black,
    fontWeight: '800',
  },
  statusBlock: {
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    padding: S.xs,
  },
  statusBlockText: {
    ...T.labelXs,
    color: C.black,
    textAlign: 'center',
    letterSpacing: 1,
  },
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.surface,
  },
  topBar: {
    width: '100%',
    paddingHorizontal: S.md,
    paddingVertical: S.xs,
    alignItems: 'center',
  },
  topBarInner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    ...T.label,
    color: C.black,
    fontWeight: '800',
  },
  topBarTitle: {
    ...T.labelSm,
    color: C.black,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  demoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: S.md,
    paddingVertical: S.unit,
    backgroundColor: C.surfaceContainerLow,
    borderBottomWidth: BORDER_THIN,
    borderBottomColor: C.black,
    gap: S.xs,
  },
  demoBarLabel: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
  },
  demoChip: {
    paddingHorizontal: S.xs,
    paddingVertical: 2,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    backgroundColor: C.surfaceContainerLowest,
  },
  demoChipActive: { backgroundColor: C.pink },
  demoChipText: {
    ...T.labelXs,
    color: C.onSurface,
    textTransform: 'uppercase',
  },
  demoChipTextActive: { color: C.black, fontWeight: '800' },
  filterRow: {
    paddingVertical: S.xs,
    borderBottomWidth: BORDER_THIN,
    borderBottomColor: C.black,
    backgroundColor: C.surfaceContainerLowest,
  },
  filterChip: {
    paddingHorizontal: S.sm,
    paddingVertical: 4,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    backgroundColor: C.surfaceContainerLowest,
  },
  filterChipActive: {
    backgroundColor: C.cyan,
    ...hardShadow(SHADOW_OFFSET_SM),
  },
  filterChipText: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  filterChipTextActive: {
    color: C.black,
    fontWeight: '800',
  },
  scroll: {
    padding: S.md,
    gap: S.sm,
  },
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    overflow: 'hidden',
  },
  titleBar: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.xs,
    borderBottomWidth: BORDER,
    borderBottomColor: C.black,
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: {
    width: 12, height: 12, borderRadius: 6,
    borderWidth: BORDER_THIN, borderColor: C.black,
  },
  titleBarLabel: {
    ...T.labelSm,
    color: C.black,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  cardBody: {
    padding: S.lg,
    gap: S.md,
  },
  // TX rows
  txRow: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: S.sm,
  },
  txRowWinShare: {
    // Win Share is a distinct visual type — cyan left border accent
    borderLeftWidth: 4,
    borderLeftColor: C.cyan,
  },
  txIconFrame: {
    width: 36,
    height: 36,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  txIcon: {
    fontSize: 18,
    lineHeight: 22,
  },
  txTopRow: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  txTypeBadge: {
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  txTypeBadgeText: {
    ...T.labelXs,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  pendingBadge: {
    backgroundColor: C.yellow,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pendingBadgeText: {
    ...T.labelXs,
    color: C.black,
    fontWeight: '800',
  },
  txGroupName: {
    ...T.label,
    color: C.onSurface,
    fontSize: 13,
  },
  txBasisLabel: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
  },
  txWinShareCopy: {
    ...T.labelXs,
    color: '#004a4a',
    fontStyle: 'italic',
  },
  txDate: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    marginTop: 2,
  },
  txAmount: {
    ...T.label,
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 20,
    flexShrink: 0,
  },
  // Empty/filter states
  emptyIconFrame: {
    width: 72,
    height: 72,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: { fontSize: 30 },
  emptyHeadline: {
    ...T.headlineMd,
    fontSize: 20,
    color: C.onSurface,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  emptyBody: {
    ...T.bodyMd,
    fontSize: 14,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  clearFilterBtn: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingVertical: S.sm,
    paddingHorizontal: S.lg,
    alignItems: 'center',
  },
  clearFilterBtnText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  // Detail modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  detailSheet: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER,
    borderColor: C.black,
    borderBottomWidth: 0,
    maxHeight: '80%',
  },
});
