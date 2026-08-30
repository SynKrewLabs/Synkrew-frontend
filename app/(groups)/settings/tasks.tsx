/**
 * SynKrew — Task Definition Management (Member-Scoped)
 * Route: app/(groups)/settings/tasks.tsx
 *
 * Implements:
 *   - Member-scoped task definition management (each member manages own tasks)
 *   - Add / edit / delete personal routines
 *   - Pause routine toggle (keeps historical data)
 *   - Navigation link to companion screen: Task Schedule Management (schedule.tsx)
 *   - Blocked state when attempting to delete the last remaining task:
 *     Stubbed with shared ErrorBanner component.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import {
  C,
  S,
  T,
  BORDER,
  BORDER_THIN,
  BORDER_HEAVY,
  SHADOW_OFFSET,
  SHADOW_OFFSET_SM,
  hardShadow,
  gridBgStyle,
} from '../../../theme/tokens';
import { TitleBar } from '../../../components/ui/TitleBar';
import { ErrorBanner } from '../../../components/ui/ErrorBanner';

interface MemberTask {
  id: string;
  title: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  target: number;
  isPaused: boolean;
}

const INITIAL_MEMBER_TASKS: MemberTask[] = [
  { id: '1', title: '5K_OUTDOOR_RUN', frequency: 'DAILY', target: 1, isPaused: false },
  { id: '2', title: 'READ_20_PAGES', frequency: 'DAILY', target: 1, isPaused: false },
  { id: '3', title: 'CODE_CHALLENGE', frequency: 'WEEKLY', target: 3, isPaused: true },
];

export default function TaskDefinitionManagement() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);
  const params = useLocalSearchParams();

  const groupName = params.name ? String(params.name) : 'NEON KNIGHTS';

  const [tasks, setTasks] = useState<MemberTask[]>(INITIAL_MEMBER_TASKS);
  const [deleteBlockedError, setDeleteBlockedError] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newFreq, setNewFreq] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY');
  const [newTarget, setNewTarget] = useState(1);

  const activeTaskCount = tasks.filter(t => !t.isPaused).length;

  const handleDeleteTask = (id: string) => {
    if (tasks.length <= 1) {
      // TODO: replace with final blocked-state design once Stitch screen is ready
      setDeleteBlockedError(
        'CANNOT DELETE LAST ROUTINE: Every member must maintain at least 1 active routine definition in the manifest.'
      );
      return;
    }
    setDeleteBlockedError(null);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleTogglePause = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.isPaused && activeTaskCount <= 1) {
      // TODO: replace with final blocked-state design once Stitch screen is ready
      setDeleteBlockedError(
        'CANNOT PAUSE LAST ACTIVE ROUTINE: At least 1 active routine is required for daily synchronization.'
      );
      return;
    }
    setDeleteBlockedError(null);
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, isPaused: !t.isPaused } : t))
    );
  };

  const handleAddTask = () => {
    if (!newTitle.trim()) return;
    if (tasks.length >= 5) return;

    const formatted = newTitle.trim().toUpperCase().replace(/\s+/g, '_');
    const newTask: MemberTask = {
      id: `task_${Date.now()}`,
      title: formatted,
      frequency: newFreq,
      target: newTarget,
      isPaused: false,
    };

    setTasks(prev => [...prev, newTask]);
    setNewTitle('');
    setNewTarget(1);
    setDeleteBlockedError(null);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
            <TitleBar label="TASK_EDITOR.EXE" color="pink" />

            <View style={styles.body}>
              {/* Header Title Block */}
              <View style={styles.headerBlock}>
                <View style={styles.memberTag}>
                  <Text style={styles.memberTagText}>MEMBER-SCOPED MANIFEST</Text>
                </View>
                <Text style={styles.headline}>MANAGE MY TASKS</Text>
                <Text style={styles.subtitle}>
                  Configure your individual routines for "{groupName.toUpperCase()}". Visible group-wide for peer verification.
                </Text>
              </View>

              {/* Blocked State Error Banner (Stubbed per UX plan / prompt) */}
              {deleteBlockedError && (
                // TODO: replace with final blocked-state design once Stitch screen is ready
                <ErrorBanner
                  message={deleteBlockedError}
                  actionLabel="DISMISS"
                  onAction={() => setDeleteBlockedError(null)}
                />
              )}

              {/* Companion Screen Link (Schedule Management) */}
              <Pressable
                testID="btn-goto-schedule-mgmt"
                style={[styles.companionBanner, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={() =>
                  router.push({
                    pathname: '/(groups)/settings/schedule',
                    params: { name: groupName },
                  })
                }
                accessibilityRole="button"
              >
                <View style={styles.companionLeft}>
                  <Text style={styles.companionIcon}>📅</Text>
                  <View>
                    <Text style={styles.companionTitle}>EDIT WEEKDAY SCHEDULE</Text>
                    <Text style={styles.companionSub}>Assign routines to 7-day dropdowns</Text>
                  </View>
                </View>
                <Text style={styles.companionArrow}>→</Text>
              </Pressable>

              {/* Active Routines List */}
              <View testID="task-mgmt-list" style={styles.taskListSection}>
                <View style={styles.listHeaderRow}>
                  <Text style={styles.listSectionTitle}>
                    MY ROUTINES ({tasks.length})
                  </Text>
                  <Text style={styles.listSectionSub}>
                    {activeTaskCount} active · {tasks.length - activeTaskCount} paused
                  </Text>
                </View>

                {tasks.map(task => (
                  <View
                    key={task.id}
                    testID={`task-def-${task.id}`}
                    style={[
                      styles.taskItem,
                      task.isPaused && styles.taskItemPaused,
                      hardShadow(SHADOW_OFFSET_SM),
                    ]}
                  >
                    <View style={styles.taskLeft}>
                      <View
                        style={[
                          styles.taskIconBox,
                          task.isPaused ? styles.taskIconBoxPaused : styles.taskIconBoxActive,
                        ]}
                      >
                        <Text style={styles.taskIcon}>
                          {task.isPaused ? '⏸' : '⚡'}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.taskTitle,
                            task.isPaused && styles.taskTitlePaused,
                          ]}
                        >
                          {task.title}
                        </Text>
                        <View style={styles.taskMetaRow}>
                          <View style={styles.freqBadge}>
                            <Text style={styles.freqBadgeText}>{task.frequency}</Text>
                          </View>
                          <Text style={styles.targetCount}>x{task.target}</Text>
                          {task.isPaused && (
                            <View style={styles.pausedBadge}>
                              <Text style={styles.pausedBadgeText}>PAUSED</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>

                    {/* Action buttons */}
                    <View style={styles.taskActionsRow}>
                      <Pressable
                        testID={`task-def-pause-${task.id}`}
                        style={styles.pauseBtn}
                        onPress={() => handleTogglePause(task.id)}
                        accessibilityRole="button"
                        accessibilityLabel={task.isPaused ? 'Resume routine' : 'Pause routine'}
                      >
                        <Text style={styles.actionBtnText}>
                          {task.isPaused ? '▶' : '⏸'}
                        </Text>
                      </Pressable>

                      <Pressable
                        testID={`task-def-delete-${task.id}`}
                        style={styles.deleteBtn}
                        onPress={() => handleDeleteTask(task.id)}
                        accessibilityRole="button"
                        accessibilityLabel={`Delete ${task.title}`}
                      >
                        <Text style={styles.deleteBtnText}>✕</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>

              {/* Add New Routine Form */}
              <View style={styles.addForm}>
                <Text style={styles.addFormTitle}>+ INITIALIZE NEW ROUTINE</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>ROUTINE NAME / IDENTIFIER</Text>
                  <TextInput
                    testID="task-mgmt-input-title"
                    style={styles.textInput}
                    placeholder="e.g. Read 20 Pages, Cold Shower"
                    placeholderTextColor={C.outline}
                    value={newTitle}
                    onChangeText={setNewTitle}
                  />
                </View>

                <View style={styles.formRow}>
                  {/* Frequency */}
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.inputLabel}>FREQUENCY</Text>
                    <View style={styles.freqRow}>
                      {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map(f => (
                        <Pressable
                          key={f}
                          style={[styles.freqChip, newFreq === f && styles.freqChipActive]}
                          onPress={() => setNewFreq(f)}
                        >
                          <Text
                            style={[
                              styles.freqChipText,
                              newFreq === f && styles.freqChipTextActive,
                            ]}
                          >
                            {f.slice(0, 1)}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  {/* Target */}
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.inputLabel}>TARGET COUNT</Text>
                    <View style={styles.counterRow}>
                      <Pressable
                        style={styles.counterBtn}
                        onPress={() => setNewTarget(prev => Math.max(1, prev - 1))}
                      >
                        <Text style={styles.counterBtnText}>-</Text>
                      </Pressable>
                      <Text style={styles.counterVal}>{newTarget}</Text>
                      <Pressable
                        style={styles.counterBtn}
                        onPress={() => setNewTarget(prev => Math.min(10, prev + 1))}
                      >
                        <Text style={styles.counterBtnText}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>

                <Pressable
                  testID="task-mgmt-btn-add"
                  style={[
                    styles.addBtn,
                    !newTitle.trim() && styles.addBtnDisabled,
                    hardShadow(SHADOW_OFFSET_SM),
                  ]}
                  onPress={handleAddTask}
                  disabled={!newTitle.trim()}
                  accessibilityRole="button"
                >
                  <Text style={styles.addBtnText}>SAVE ROUTINE TO MANIFEST</Text>
                </Pressable>
              </View>

              {/* Back to Group Settings */}
              <Pressable
                testID="task-mgmt-btn-back"
                style={styles.backBtn}
                onPress={() => router.back()}
                accessibilityRole="button"
              >
                <Text style={styles.backBtnText}>← RETURN TO GROUP SETTINGS</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.surface,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: S.md,
  },
  card: {
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    overflow: 'hidden',
  },
  body: {
    padding: S.xl,
    gap: S.md,
  },

  // Header Block
  headerBlock: {
    gap: 4,
  },
  memberTag: {
    alignSelf: 'flex-start',
    backgroundColor: C.cyan,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 2,
  },
  memberTagText: {
    ...T.labelXs,
    fontSize: 9,
    fontWeight: '900',
    color: C.black,
  },
  headline: {
    ...T.headlineMd,
    fontSize: 22,
    color: C.black,
    textTransform: 'uppercase',
  },
  subtitle: {
    ...T.bodyMd,
    fontSize: 13,
    color: C.onSurfaceVariant,
    lineHeight: 18,
  },

  // Companion Banner
  companionBanner: {
    backgroundColor: C.secondaryContainer,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  companionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
  },
  companionIcon: {
    fontSize: 20,
  },
  companionTitle: {
    ...T.labelSm,
    fontSize: 11,
    fontWeight: '900',
    color: '#002115',
    letterSpacing: 0.5,
  },
  companionSub: {
    ...T.bodyMd,
    fontSize: 10,
    color: '#00513a',
  },
  companionArrow: {
    fontSize: 16,
    fontWeight: '900',
    color: C.black,
  },

  // Task List
  taskListSection: {
    gap: 6,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listSectionTitle: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 0.5,
    fontSize: 11,
  },
  listSectionSub: {
    ...T.labelXs,
    fontSize: 9,
    color: C.onSurfaceVariant,
  },
  taskItem: {
    backgroundColor: C.surfaceContainerLow,
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskItemPaused: {
    backgroundColor: C.surfaceVariant,
    opacity: 0.8,
  },
  taskLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
  },
  taskIconBox: {
    width: 32,
    height: 32,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskIconBoxActive: {
    backgroundColor: C.mint,
  },
  taskIconBoxPaused: {
    backgroundColor: C.surfaceDim,
  },
  taskIcon: {
    fontSize: 16,
  },
  taskTitle: {
    ...T.labelSm,
    fontSize: 12,
    color: C.black,
    fontWeight: '900',
  },
  taskTitlePaused: {
    color: C.onSurfaceVariant,
    textDecorationLine: 'line-through',
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  freqBadge: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.black,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  freqBadgeText: {
    ...T.labelXs,
    fontSize: 8,
    color: C.black,
    fontWeight: '900',
  },
  targetCount: {
    ...T.labelXs,
    fontSize: 9,
    color: C.onSurfaceVariant,
    fontWeight: '800',
  },
  pausedBadge: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#856404',
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  pausedBadgeText: {
    ...T.labelXs,
    fontSize: 8,
    color: '#856404',
    fontWeight: '900',
  },
  taskActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pauseBtn: {
    width: 28,
    height: 28,
    backgroundColor: C.white,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    width: 28,
    height: 28,
    backgroundColor: C.white,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: C.black,
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: C.black,
  },

  // Add form
  addForm: {
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    borderStyle: 'dashed',
    padding: S.md,
    gap: S.sm,
  },
  addFormTitle: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    ...T.labelXs,
    fontSize: 9,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  textInput: {
    height: 40,
    backgroundColor: C.surface,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    ...T.bodyMd,
    fontSize: 13,
    color: C.onSurface,
  },
  formRow: {
    flexDirection: 'row',
    gap: S.sm,
  },
  freqRow: {
    flexDirection: 'row',
    height: 38,
    borderWidth: BORDER,
    borderColor: C.black,
    backgroundColor: C.surface,
  },
  freqChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: C.black,
  },
  freqChipActive: {
    backgroundColor: C.pink,
  },
  freqChipText: {
    ...T.labelSm,
    fontSize: 11,
    color: C.black,
    fontWeight: '800',
  },
  freqChipTextActive: {
    fontWeight: '900',
  },
  counterRow: {
    flexDirection: 'row',
    height: 38,
    borderWidth: BORDER,
    borderColor: C.black,
    backgroundColor: C.surface,
    alignItems: 'center',
  },
  counterBtn: {
    width: 32,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surfaceContainerHigh,
  },
  counterBtnText: {
    fontSize: 16,
    fontWeight: '900',
    color: C.black,
  },
  counterVal: {
    flex: 1,
    textAlign: 'center',
    ...T.labelSm,
    fontSize: 13,
    color: C.black,
    fontWeight: '900',
  },
  addBtn: {
    height: 40,
    backgroundColor: C.primaryFixedDim,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  addBtnDisabled: {
    opacity: 0.45,
  },
  addBtnText: {
    ...T.labelSm,
    fontSize: 11,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1,
  },

  // Back Button
  backBtn: {
    width: '100%',
    paddingVertical: S.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
    fontSize: 11,
    fontWeight: '700',
  },
});
