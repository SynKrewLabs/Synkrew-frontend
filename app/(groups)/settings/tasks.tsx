/**
 * SynKrew — Task Definition Management
 * Route: app/(groups)/settings/tasks.tsx
 *
 * Implements:
 *   - Active routine manifest list
 *   - Inline task addition & editing
 *   - Delete routine action
 *   - Cannot delete last task (Blocked state) modal
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
  Modal,
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

interface TaskDef {
  id: string;
  title: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  target: number;
}

export default function TaskDefinitionManagement() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);
  const params = useLocalSearchParams();

  const [tasks, setTasks] = useState<TaskDef[]>([
    { id: '1', title: '5K_OUTDOOR_RUN', frequency: 'DAILY', target: 1 },
    { id: '2', title: 'READ_20_PAGES', frequency: 'DAILY', target: 1 },
    { id: '3', title: 'CODE_CHALLENGE', frequency: 'WEEKLY', target: 3 },
  ]);

  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newFreq, setNewFreq] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY');
  const [newTarget, setNewTarget] = useState(1);

  const handleDeleteTask = (id: string) => {
    if (tasks.length <= 1) {
      // Cannot delete last task: block with explicit explanation
      setShowBlockedModal(true);
      return;
    }
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAddTask = () => {
    if (!newTitle.trim()) return;
    const item: TaskDef = {
      id: `task_${Date.now()}`,
      title: newTitle.trim().toUpperCase().replace(/\s+/g, '_'),
      frequency: newFreq,
      target: newTarget,
    };
    setTasks(prev => [...prev, item]);
    setNewTitle('');
    setNewTarget(1);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="TASK_EDITOR.EXE" color="pink" />

          <View style={styles.body}>
            {/* Header */}
            <View style={styles.headerBlock}>
              <Text style={styles.headline}>TASK MANIFEST</Text>
              <Text style={styles.subtitle}>
                Define the collective rituals for {params.name ? `"${String(params.name)}"` : 'your Krew'}.
              </Text>
            </View>

            {/* Task List */}
            <View testID="task-mgmt-list" style={styles.taskList}>
              <Text style={styles.listSectionTitle}>ACTIVE ROUTINES ({tasks.length})</Text>
              {tasks.map(task => (
                <View key={task.id} testID={`task-def-${task.id}`} style={[styles.taskItem, hardShadow(SHADOW_OFFSET_SM)]}>
                  <View style={styles.taskLeft}>
                    <View style={styles.taskIconBox}>
                      <Text style={styles.taskIcon}>⚡</Text>
                    </View>
                    <View>
                      <Text style={styles.taskTitle}>{task.title}</Text>
                      <View style={styles.taskMetaRow}>
                        <View style={styles.freqBadge}>
                          <Text style={styles.freqBadgeText}>{task.frequency}</Text>
                        </View>
                        <Text style={styles.targetCount}>x{task.target}</Text>
                      </View>
                    </View>
                  </View>

                  <Pressable
                    testID={`task-def-delete-${task.id}`}
                    style={styles.deleteBtn}
                    onPress={() => handleDeleteTask(task.id)}
                    accessibilityRole="button"
                  >
                    <Text style={styles.deleteIcon}>🗑️</Text>
                  </Pressable>
                </View>
              ))}
            </View>

            {/* Add Task Form */}
            <View style={styles.addForm}>
              <Text style={styles.addFormTitle}>+ INITIALIZE NEW ROUTINE</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>TASK ID / TITLE</Text>
                <TextInput
                  testID="task-mgmt-input-title"
                  style={styles.textInput}
                  placeholder="e.g. Cold Plunge 3 Mins"
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
                        <Text style={[styles.freqChipText, newFreq === f && styles.freqChipTextActive]}>
                          {f.slice(0, 1)}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Target */}
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.inputLabel}>TARGET</Text>
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
                      onPress={() => setNewTarget(prev => prev + 1)}
                    >
                      <Text style={styles.counterBtnText}>+</Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              <Pressable
                testID="task-mgmt-btn-add"
                style={[styles.addBtn, !newTitle.trim() && styles.addBtnDisabled, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={handleAddTask}
                disabled={!newTitle.trim()}
              >
                <Text style={styles.addBtnText}>SAVE ROUTINE TO MANIFEST</Text>
              </Pressable>
            </View>

            {/* Back Button */}
            <Pressable
              testID="task-mgmt-btn-back"
              style={styles.backBtn}
              onPress={() => router.back()}
              accessibilityRole="button"
            >
              <Text style={styles.backBtnText}>← RETURN TO SETTINGS</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* ─── Cannot Delete Last Task (Blocked) Modal ─── */}
      <Modal
        visible={showBlockedModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBlockedModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View testID="task-delete-blocked-modal" style={[styles.modalCard, hardShadow(SHADOW_OFFSET)]}>
            <TitleBar label="OPERATION_HALTED.EXE" color="pink" />

            <View style={styles.modalBody}>
              <View style={styles.modalIconBox}>
                <Text style={styles.modalIcon}>⚠️</Text>
              </View>

              <View style={styles.modalBadge}>
                <Text style={styles.modalBadgeText}>CANNOT_DELETE_LAST_TASK</Text>
              </View>

              <Text style={styles.modalTitle}>MINIMUM 1 TASK REQUIRED</Text>

              <Text style={styles.modalDesc}>
                A group needs at least one active routine definition to maintain synchronization rituals. To remove this routine, add a replacement first.
              </Text>

              <Pressable
                testID="task-blocked-btn-dismiss"
                style={[styles.modalDismissBtn, hardShadow(SHADOW_OFFSET_SM)]}
                onPress={() => setShowBlockedModal(false)}
              >
                <Text style={styles.modalDismissBtnText}>ACKNOWLEDGE & KEEP TASK</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    gap: S.lg,
  },

  headerBlock: {
    alignItems: 'center',
    gap: 4,
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
    textAlign: 'center',
  },

  // Task list
  taskList: {
    gap: S.xs,
  },
  listSectionTitle: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 2,
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
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
  },
  taskIconBox: {
    width: 36,
    height: 36,
    backgroundColor: C.secondaryContainer,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskIcon: {
    fontSize: 18,
  },
  taskTitle: {
    ...T.labelSm,
    fontSize: 13,
    color: C.black,
    fontWeight: '900',
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  freqBadge: {
    backgroundColor: C.cyan,
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
    color: C.onSurfaceVariant,
    fontWeight: '700',
  },
  deleteBtn: {
    padding: 6,
  },
  deleteIcon: {
    fontSize: 18,
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
    letterSpacing: 0.5,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    ...T.labelXs,
    fontSize: 10,
    color: C.black,
    fontWeight: '800',
  },
  textInput: {
    height: 42,
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
    height: 42,
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
    color: C.black,
    fontWeight: '800',
  },
  freqChipTextActive: {
    fontWeight: '900',
  },
  counterRow: {
    flexDirection: 'row',
    height: 42,
    borderWidth: BORDER,
    borderColor: C.black,
    backgroundColor: C.surface,
    alignItems: 'center',
  },
  counterBtn: {
    width: 36,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surfaceContainerHigh,
  },
  counterBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: C.black,
  },
  counterVal: {
    flex: 1,
    textAlign: 'center',
    ...T.labelSm,
    fontSize: 13,
    color: C.black,
    fontWeight: '800',
  },
  addBtn: {
    height: 44,
    backgroundColor: C.primaryFixedDim,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  addBtnDisabled: {
    opacity: 0.4,
  },
  addBtnText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1,
  },

  backBtn: {
    width: '100%',
    paddingVertical: S.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    ...T.labelSm,
    color: C.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '700',
  },

  // Blocked Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: S.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: C.surfaceContainerLowest,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    overflow: 'hidden',
  },
  modalBody: {
    padding: S.xl,
    alignItems: 'center',
    gap: S.sm,
  },
  modalIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffdad6',
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  modalIcon: {
    fontSize: 32,
  },
  modalBadge: {
    backgroundColor: '#ffdad6',
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  modalBadgeText: {
    ...T.labelXs,
    color: '#ba1a1a',
    fontWeight: '900',
  },
  modalTitle: {
    ...T.headlineMd,
    fontSize: 18,
    color: C.black,
    textAlign: 'center',
  },
  modalDesc: {
    ...T.bodyMd,
    fontSize: 12,
    color: C.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 17,
  },
  modalDismissBtn: {
    width: '100%',
    height: 48,
    backgroundColor: C.pink,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: S.sm,
  },
  modalDismissBtnText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
