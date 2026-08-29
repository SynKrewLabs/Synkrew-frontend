/**
 * SynKrew — Create Group: Step 2 (Task Definitions)
 * Route: app/(groups)/create/step-2.tsx
 *
 * Implements:
 *   - Task list with frequency & target count
 *   - Adding new custom tasks
 *   - Deleting tasks
 *   - Blocked state when 0 tasks are added (Next button visibly disabled + inline warning)
 *   - Progression to Step 3
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

interface TaskItem {
  id: string;
  title: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  target: number;
}

export default function CreateGroupStep2() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);
  const params = useLocalSearchParams();

  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'task_1',
      title: '5K_RUN',
      frequency: 'WEEKLY',
      target: 3,
    },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newFrequency, setNewFrequency] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('WEEKLY');
  const [newTarget, setNewTarget] = useState(1);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const item: TaskItem = {
      id: `task_${Date.now()}`,
      title: newTaskTitle.trim().toUpperCase().replace(/\s+/g, '_'),
      frequency: newFrequency,
      target: newTarget,
    };
    setTasks(prev => [...prev, item]);
    setNewTaskTitle('');
    setNewTarget(1);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleNext = () => {
    if (tasks.length === 0) return;
    router.push({
      pathname: '/(groups)/create/step-3',
      params: {
        ...params,
        taskCount: String(tasks.length),
      },
    });
  };

  const isBlocked = tasks.length === 0;

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
            <TitleBar label="TASK_MANIFEST.EXE" color="pink" />

            <View style={styles.body}>
              {/* Progress Header */}
              <View style={styles.progressHeader}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.stepTag}>STEP 2/3</Text>
                  <Text style={styles.stepStatus}>DEFINING TASKS...</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressSegment, styles.progressFilled]} />
                  <View style={[styles.progressSegment, styles.progressFilled]} />
                  <View style={styles.progressSegment} />
                </View>
              </View>

              {/* Instructions */}
              <Text style={styles.instructions}>
                Establish the routines for your Krew. What objectives must be cleared to level up?
              </Text>

              {/* Blocked State Inline Warning (when 0 tasks exist) */}
              {isBlocked && (
                <View testID="step2-blocked-warning" style={[styles.blockedBanner, hardShadow(SHADOW_OFFSET_SM)]}>
                  <Text style={styles.blockedIcon}>⚠️</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.blockedTitle}>ROUTINE MANIFEST EMPTY</Text>
                    <Text style={styles.blockedText}>
                      At least one task definition is required to proceed. Use the form below to initialize a routine.
                    </Text>
                  </View>
                </View>
              )}

              {/* Active Tasks List */}
              {tasks.length > 0 && (
                <View testID="step2-task-list" style={styles.taskList}>
                  {tasks.map(task => (
                    <View
                      key={task.id}
                      testID={`task-item-${task.id}`}
                      style={[styles.taskCard, hardShadow(SHADOW_OFFSET_SM)]}
                    >
                      <View style={styles.taskLeft}>
                        <View style={styles.taskIconBox}>
                          <Text style={styles.taskIcon}>🏃</Text>
                        </View>
                        <View>
                          <Text style={styles.taskTitle}>{task.title}</Text>
                          <View style={styles.taskMetaRow}>
                            <View style={styles.freqTag}>
                              <Text style={styles.freqTagText}>{task.frequency}</Text>
                            </View>
                            <Text style={styles.taskTargetText}>x{task.target}</Text>
                          </View>
                        </View>
                      </View>

                      <Pressable
                        testID={`task-delete-${task.id}`}
                        style={styles.deleteBtn}
                        onPress={() => handleDeleteTask(task.id)}
                        accessibilityRole="button"
                        accessibilityLabel={`Delete ${task.title}`}
                      >
                        <Text style={styles.deleteIcon}>🗑️</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}

              {/* Add New Task Form Area */}
              <View style={styles.addTaskForm}>
                <View style={styles.addFormHeader}>
                  <Text style={styles.addFormIcon}>➕</Text>
                  <Text style={styles.addFormTitle}>INITIALIZE NEW TASK</Text>
                </View>

                {/* Task Title */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>TASK_ID (TITLE)</Text>
                  <TextInput
                    testID="step2-input-task-title"
                    style={styles.textInput}
                    placeholder="e.g. Read 20 Pages"
                    placeholderTextColor={C.outline}
                    value={newTaskTitle}
                    onChangeText={setNewTaskTitle}
                  />
                </View>

                {/* Frequency and Target in 2 columns */}
                <View style={styles.formRow}>
                  {/* Frequency */}
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.formLabel}>FREQUENCY</Text>
                    <View style={styles.freqSelector}>
                      {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map(freq => (
                        <Pressable
                          key={freq}
                          testID={`step2-freq-${freq.toLowerCase()}`}
                          style={[
                            styles.freqOption,
                            newFrequency === freq && styles.freqOptionActive,
                          ]}
                          onPress={() => setNewFrequency(freq)}
                        >
                          <Text
                            style={[
                              styles.freqOptionText,
                              newFrequency === freq && styles.freqOptionTextActive,
                            ]}
                          >
                            {freq.slice(0, 1)}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  {/* Target Counter */}
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.formLabel}>TARGET COUNT</Text>
                    <View style={styles.counterBox}>
                      <Pressable
                        testID="step2-btn-target-minus"
                        style={styles.counterBtn}
                        onPress={() => setNewTarget(prev => Math.max(1, prev - 1))}
                      >
                        <Text style={styles.counterBtnText}>-</Text>
                      </Pressable>
                      <Text testID="step2-target-value" style={styles.counterValue}>{newTarget}</Text>
                      <Pressable
                        testID="step2-btn-target-plus"
                        style={styles.counterBtn}
                        onPress={() => setNewTarget(prev => prev + 1)}
                      >
                        <Text style={styles.counterBtnText}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>

                {/* Add Task Button */}
                <Pressable
                  testID="step2-btn-add-task"
                  style={[
                    styles.addTaskBtn,
                    !newTaskTitle.trim() && styles.addTaskBtnDisabled,
                    hardShadow(SHADOW_OFFSET_SM),
                  ]}
                  onPress={handleAddTask}
                  disabled={!newTaskTitle.trim()}
                  accessibilityRole="button"
                >
                  <Text style={styles.addTaskBtnText}>+ ADD_NEW_TASK</Text>
                </Pressable>
              </View>

              {/* Bottom Nav Action Buttons */}
              <View style={styles.actionRow}>
                <Pressable
                  testID="step2-btn-back"
                  style={styles.backBtn}
                  onPress={() => router.back()}
                  accessibilityRole="button"
                >
                  <Text style={styles.backBtnText}>BACK</Text>
                </Pressable>

                <Pressable
                  testID="step2-btn-next-phase"
                  style={[
                    styles.nextPhaseBtn,
                    isBlocked && styles.nextPhaseBtnDisabled,
                    hardShadow(SHADOW_OFFSET_SM),
                  ]}
                  onPress={handleNext}
                  disabled={isBlocked}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: isBlocked }}
                >
                  <Text style={styles.nextPhaseBtnText}>
                    {isBlocked ? 'BLOCKED' : 'NEXT_PHASE'}
                  </Text>
                  <Text style={styles.nextPhaseBtnArrow}>→</Text>
                </Pressable>
              </View>
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
    padding: S.lg,
    gap: S.md,
  },

  // Progress header
  progressHeader: {
    gap: 6,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTag: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
  },
  stepStatus: {
    ...T.labelXs,
    color: C.onSurfaceVariant,
    fontWeight: '700',
  },
  progressBar: {
    width: '100%',
    height: 12,
    borderWidth: BORDER,
    borderColor: C.black,
    backgroundColor: C.surfaceContainerLowest,
    flexDirection: 'row',
    padding: 2,
    gap: 2,
  },
  progressSegment: {
    flex: 1,
    height: '100%',
    backgroundColor: C.surfaceVariant,
  },
  progressFilled: {
    backgroundColor: C.cyan,
  },

  instructions: {
    ...T.bodyMd,
    fontSize: 14,
    color: C.onSurfaceVariant,
  },

  // Blocked Banner
  blockedBanner: {
    backgroundColor: '#ffdad6',
    borderWidth: BORDER,
    borderColor: C.black,
    padding: S.sm,
    flexDirection: 'row',
    gap: S.xs,
    alignItems: 'center',
  },
  blockedIcon: {
    fontSize: 18,
    color: '#ba1a1a',
  },
  blockedTitle: {
    ...T.labelSm,
    color: '#ba1a1a',
    fontWeight: '800',
  },
  blockedText: {
    ...T.bodyMd,
    fontSize: 12,
    color: '#53424b',
  },

  // Task list
  taskList: {
    gap: S.xs,
  },
  taskCard: {
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
    ...T.headlineMd,
    fontSize: 16,
    color: C.black,
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  freqTag: {
    backgroundColor: C.cyan,
    borderWidth: 1,
    borderColor: C.black,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  freqTagText: {
    ...T.labelXs,
    fontSize: 9,
    color: C.black,
    fontWeight: '800',
  },
  taskTargetText: {
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

  // Add Task Form
  addTaskForm: {
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    borderStyle: 'dashed',
    padding: S.md,
    gap: S.sm,
    marginTop: 4,
  },
  addFormHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addFormIcon: {
    fontSize: 14,
  },
  addFormTitle: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
    letterSpacing: 1,
  },
  formGroup: {
    gap: 4,
  },
  formLabel: {
    ...T.labelXs,
    color: C.black,
    fontWeight: '800',
    fontSize: 10,
  },
  textInput: {
    height: 42,
    backgroundColor: C.surface,
    borderWidth: BORDER,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    ...T.bodyMd,
    fontSize: 14,
    color: C.onSurface,
  },
  formRow: {
    flexDirection: 'row',
    gap: S.sm,
  },
  freqSelector: {
    flexDirection: 'row',
    borderWidth: BORDER,
    borderColor: C.black,
    backgroundColor: C.surface,
    height: 42,
  },
  freqOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: C.black,
  },
  freqOptionActive: {
    backgroundColor: C.pink,
  },
  freqOptionText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
  },
  freqOptionTextActive: {
    color: C.black,
  },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: BORDER,
    borderColor: C.black,
    backgroundColor: C.surface,
    height: 42,
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
    fontWeight: '800',
    color: C.black,
  },
  counterValue: {
    flex: 1,
    textAlign: 'center',
    ...T.labelSm,
    fontSize: 14,
    color: C.black,
    fontWeight: '800',
  },
  addTaskBtn: {
    backgroundColor: C.primaryFixedDim,
    borderWidth: BORDER,
    borderColor: C.black,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  addTaskBtnDisabled: {
    opacity: 0.5,
  },
  addTaskBtnText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // Action Buttons
  actionRow: {
    flexDirection: 'row',
    gap: S.sm,
    marginTop: S.sm,
  },
  backBtn: {
    flex: 1,
    height: 48,
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: BORDER,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
    ...hardShadow(SHADOW_OFFSET_SM),
  },
  backBtnText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
  },
  nextPhaseBtn: {
    flex: 2,
    height: 48,
    backgroundColor: C.secondaryContainer,
    borderWidth: BORDER,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  nextPhaseBtnDisabled: {
    backgroundColor: C.surfaceDim,
    opacity: 0.45,
  },
  nextPhaseBtnText: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '800',
    letterSpacing: 1,
  },
  nextPhaseBtnArrow: {
    fontSize: 16,
    color: C.black,
    fontWeight: '900',
  },
});
