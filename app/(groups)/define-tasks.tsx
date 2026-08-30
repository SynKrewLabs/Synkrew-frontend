/**
 * SynKrew — Define Tasks (Shared Screen)
 * Route: app/(groups)/define-tasks.tsx
 *
 * Used by BOTH Create Group (Entry Point 1) and Join Group (Entry Point 2).
 * Allows the user (creator or joining member) to define up to 3 personal tasks.
 *
 * Implements:
 *   - Up to 3 personal task definitions (title, frequency, target count)
 *   - Adding new custom tasks
 *   - Deleting tasks
 *   - Blocked state when 0 tasks are added (Next button disabled + inline warning)
 *   - Dynamic navigation: routes forward to Schedule Tasks preserving mode ('create' | 'join')
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
} from '../../theme/tokens';
import { TitleBar } from '../../components/ui/TitleBar';
import { ErrorBanner } from '../../components/ui/ErrorBanner';

export interface TaskDefinition {
  id: string;
  title: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  target: number;
}

const DEFAULT_TASKS: TaskDefinition[] = [
  {
    id: 'task_1',
    title: 'MORNING RUN 5K',
    frequency: 'DAILY',
    target: 1,
  },
  {
    id: 'task_2',
    title: 'MEDITATION 15M',
    frequency: 'DAILY',
    target: 1,
  },
  {
    id: 'task_3',
    title: 'CODE SPRINT 1HR',
    frequency: 'DAILY',
    target: 1,
  },
];

export default function DefineTasksScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);
  const params = useLocalSearchParams();

  const mode = (params.mode as string) || (params.name && !params.inviter ? 'create' : 'join');
  const isCreateMode = mode === 'create';

  const [tasks, setTasks] = useState<TaskDefinition[]>(DEFAULT_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newFrequency, setNewFrequency] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY');
  const [newTarget, setNewTarget] = useState(1);
  const [inputError, setInputError] = useState<string | null>(null);

  const isMaxTasksReached = tasks.length >= 3;
  const isBlocked = tasks.length === 0;

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      setInputError('Task title cannot be empty.');
      return;
    }
    if (isMaxTasksReached) {
      setInputError('Maximum 3 personal routines allowed.');
      return;
    }
    const formattedTitle = newTaskTitle.trim().toUpperCase().replace(/\s+/g, ' ');
    if (tasks.some(t => t.title === formattedTitle)) {
      setInputError('A routine with this name already exists.');
      return;
    }

    const newTask: TaskDefinition = {
      id: `task_${Date.now()}`,
      title: formattedTitle,
      frequency: newFrequency,
      target: newTarget,
    };

    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
    setNewTarget(1);
    setInputError(null);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleNext = () => {
    if (isBlocked) return;
    router.push({
      pathname: '/(groups)/schedule-tasks',
      params: {
        ...params,
        mode,
        tasksData: JSON.stringify(tasks),
        taskCount: String(tasks.length),
      },
    });
  };

  const handleBack = () => {
    if (isCreateMode) {
      router.push({
        pathname: '/(groups)/create/step-1',
        params,
      });
    } else {
      router.push({
        pathname: '/(groups)/join',
        params,
      });
    }
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
            <TitleBar label="DEFINE_TASKS.EXE" color="pink" />

            <View style={styles.body}>
              {/* Step indicator header */}
              <View style={styles.stepHeader}>
                <View style={styles.stepLabelRow}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>
                      {isCreateMode ? 'STEP 2 OF 5' : 'STEP 1 OF 2'}
                    </Text>
                  </View>
                  <Text style={styles.stepContext}>
                    {isCreateMode ? 'CREATE PACT' : 'JOIN PACT'}
                  </Text>
                </View>
                {/* Progress bar */}
                <View style={styles.progressBar}>
                  <View style={[styles.progressSegment, styles.progressFilled]} />
                  <View style={[styles.progressSegment, isCreateMode ? {} : styles.progressFilled]} />
                  {isCreateMode && (
                    <>
                      <View style={styles.progressSegment} />
                      <View style={styles.progressSegment} />
                      <View style={styles.progressSegment} />
                    </>
                  )}
                </View>
              </View>

              {/* Title & instructions */}
              <View style={styles.titleBlock}>
                <Text style={styles.headline}>ADD YOUR TASKS</Text>
                <Text style={styles.subtitle}>
                  Define up to 3 personal routines you will commit to. At least 1 task is required.
                </Text>
              </View>

              {/* Blocked State Banner (when 0 tasks exist) */}
              {isBlocked && (
                <View testID="define-tasks-blocked-banner" style={[styles.blockedBanner, hardShadow(SHADOW_OFFSET_SM)]}>
                  <Text style={styles.blockedIcon}>⚠️</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.blockedTitle}>ROUTINE MANIFEST EMPTY</Text>
                    <Text style={styles.blockedText}>
                      At least one task definition is required to proceed. Add a routine below.
                    </Text>
                  </View>
                </View>
              )}

              {/* Active Tasks List */}
              {tasks.length > 0 && (
                <View testID="define-tasks-list" style={styles.taskListContainer}>
                  <View style={styles.taskListHeader}>
                    <Text style={styles.taskListLabel}>YOUR ROUTINES ({tasks.length}/3)</Text>
                    <Text style={styles.taskListSub}>Visible to all members for verification</Text>
                  </View>

                  <View style={styles.taskCardsStack}>
                    {tasks.map((task, index) => (
                      <View
                        key={task.id}
                        testID={`task-item-${task.id}`}
                        style={[styles.taskCard, hardShadow(SHADOW_OFFSET_SM)]}
                      >
                        <View style={styles.taskLeft}>
                          <View style={[styles.taskIndexBox, { backgroundColor: index === 0 ? C.secondaryContainer : index === 1 ? C.pink : C.cyan }]}>
                            <Text style={styles.taskIndexText}>{index + 1}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.taskTitle}>{task.title}</Text>
                            <View style={styles.taskMetaRow}>
                              <View style={styles.freqTag}>
                                <Text style={styles.freqTagText}>{task.frequency}</Text>
                              </View>
                              <Text style={styles.taskTargetText}>TARGET: {task.target}X</Text>
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
                          <Text style={styles.deleteIconText}>✕</Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Add New Task Form (only if under 3 tasks) */}
              {!isMaxTasksReached ? (
                <View style={styles.addFormContainer}>
                  <View style={styles.addFormHeader}>
                    <Text style={styles.addFormTitle}>+ ADD ROUTINE ({tasks.length + 1}/3)</Text>
                  </View>

                  {inputError && (
                    <Text style={styles.inputErrorText}>⚠ {inputError}</Text>
                  )}

                  {/* Task Title Input */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>ROUTINE NAME</Text>
                    <TextInput
                      testID="input-task-title"
                      style={styles.textInput}
                      placeholder="e.g. Read 20 Pages, 5K Run"
                      placeholderTextColor={C.outline}
                      value={newTaskTitle}
                      onChangeText={val => {
                        setNewTaskTitle(val);
                        if (inputError) setInputError(null);
                      }}
                      maxLength={40}
                    />
                  </View>

                  {/* Frequency & Target */}
                  <View style={styles.formRow}>
                    {/* Frequency */}
                    <View style={{ flex: 1, gap: 4 }}>
                      <Text style={styles.formLabel}>FREQUENCY</Text>
                      <View style={styles.freqSelector}>
                        {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map(freq => (
                          <Pressable
                            key={freq}
                            testID={`freq-${freq.toLowerCase()}`}
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

                    {/* Target Count */}
                    <View style={{ flex: 1, gap: 4 }}>
                      <Text style={styles.formLabel}>TARGET COUNT</Text>
                      <View style={styles.counterBox}>
                        <Pressable
                          testID="btn-target-minus"
                          style={styles.counterBtn}
                          onPress={() => setNewTarget(prev => Math.max(1, prev - 1))}
                        >
                          <Text style={styles.counterBtnText}>-</Text>
                        </Pressable>
                        <Text testID="target-value" style={styles.counterValue}>{newTarget}</Text>
                        <Pressable
                          testID="btn-target-plus"
                          style={styles.counterBtn}
                          onPress={() => setNewTarget(prev => Math.min(10, prev + 1))}
                        >
                          <Text style={styles.counterBtnText}>+</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>

                  {/* Add Button */}
                  <Pressable
                    testID="btn-add-task"
                    style={[
                      styles.addTaskBtn,
                      !newTaskTitle.trim() && styles.addTaskBtnDisabled,
                      hardShadow(SHADOW_OFFSET_SM),
                    ]}
                    onPress={handleAddTask}
                    disabled={!newTaskTitle.trim()}
                    accessibilityRole="button"
                  >
                    <Text style={styles.addTaskBtnText}>+ CONFIRM TASK</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.maxTasksNotice}>
                  <Text style={styles.maxTasksText}>✓ MAXIMUM 3 ROUTINES DEFINED</Text>
                </View>
              )}

              {/* Action Row */}
              <View style={styles.actionRow}>
                <Pressable
                  testID="btn-back"
                  style={styles.backBtn}
                  onPress={handleBack}
                  accessibilityRole="button"
                >
                  <Text style={styles.backBtnText}>BACK</Text>
                </Pressable>

                <Pressable
                  testID="btn-next"
                  style={[
                    styles.nextBtn,
                    isBlocked && styles.nextBtnDisabled,
                    hardShadow(isBlocked ? 0 : SHADOW_OFFSET_SM),
                  ]}
                  onPress={handleNext}
                  disabled={isBlocked}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: isBlocked }}
                >
                  <Text style={styles.nextBtnText}>
                    {isBlocked ? 'BLOCKED' : 'SCHEDULE TASKS'}
                  </Text>
                  <Text style={styles.nextBtnArrow}>→</Text>
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
    padding: S.xl,
    gap: S.md,
  },

  // Step Header
  stepHeader: {
    gap: 6,
  },
  stepLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepBadge: {
    backgroundColor: C.secondaryContainer,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  stepBadgeText: {
    ...T.labelXs,
    fontSize: 9,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1,
  },
  stepContext: {
    ...T.labelXs,
    fontSize: 9,
    color: C.onSurfaceVariant,
    fontWeight: '800',
  },
  progressBar: {
    width: '100%',
    height: 10,
    borderWidth: BORDER,
    borderColor: C.black,
    backgroundColor: C.white,
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

  // Title Block
  titleBlock: {
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
    lineHeight: 18,
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
    fontSize: 20,
  },
  blockedTitle: {
    ...T.labelSm,
    color: '#ba1a1a',
    fontWeight: '900',
    fontSize: 11,
  },
  blockedText: {
    ...T.bodyMd,
    fontSize: 12,
    color: '#53424b',
    lineHeight: 16,
  },

  // Tasks List
  taskListContainer: {
    gap: 6,
  },
  taskListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskListLabel: {
    ...T.labelSm,
    fontSize: 11,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  taskListSub: {
    ...T.labelXs,
    fontSize: 9,
    color: C.onSurfaceVariant,
  },
  taskCardsStack: {
    gap: 8,
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
  },
  taskIndexBox: {
    width: 32,
    height: 32,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskIndexText: {
    ...T.labelSm,
    fontSize: 12,
    fontWeight: '900',
    color: C.black,
  },
  taskTitle: {
    ...T.headlineMd,
    fontSize: 14,
    color: C.black,
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  freqTag: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.black,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  freqTagText: {
    ...T.labelXs,
    fontSize: 8,
    color: C.black,
    fontWeight: '900',
  },
  taskTargetText: {
    ...T.labelXs,
    fontSize: 9,
    color: C.onSurfaceVariant,
    fontWeight: '800',
  },
  deleteBtn: {
    width: 28,
    height: 28,
    backgroundColor: C.white,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  deleteIconText: {
    fontSize: 12,
    fontWeight: '900',
    color: C.black,
  },

  // Add Task Form
  addFormContainer: {
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    borderStyle: 'dashed',
    padding: S.md,
    gap: S.sm,
  },
  addFormHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addFormTitle: {
    ...T.labelSm,
    color: C.black,
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  inputErrorText: {
    ...T.labelXs,
    color: '#ba1a1a',
    fontSize: 10,
    fontWeight: '800',
  },
  formGroup: {
    gap: 4,
  },
  formLabel: {
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
  freqSelector: {
    flexDirection: 'row',
    borderWidth: BORDER,
    borderColor: C.black,
    backgroundColor: C.surface,
    height: 38,
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
    fontSize: 11,
    color: C.black,
    fontWeight: '800',
  },
  freqOptionTextActive: {
    fontWeight: '900',
  },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: BORDER,
    borderColor: C.black,
    backgroundColor: C.surface,
    height: 38,
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
  counterValue: {
    flex: 1,
    textAlign: 'center',
    ...T.labelSm,
    fontSize: 13,
    color: C.black,
    fontWeight: '900',
  },
  addTaskBtn: {
    backgroundColor: C.secondaryContainer,
    borderWidth: BORDER,
    borderColor: C.black,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  addTaskBtnDisabled: {
    opacity: 0.45,
  },
  addTaskBtnText: {
    ...T.labelSm,
    fontSize: 11,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1,
  },
  maxTasksNotice: {
    backgroundColor: C.secondaryContainer,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    padding: S.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maxTasksText: {
    ...T.labelSm,
    fontSize: 11,
    color: '#00513a',
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  // Actions
  actionRow: {
    flexDirection: 'row',
    gap: S.sm,
    marginTop: S.xs,
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
    fontSize: 12,
    color: C.black,
    fontWeight: '900',
  },
  nextBtn: {
    flex: 2,
    height: 48,
    backgroundColor: C.pink,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  nextBtnDisabled: {
    backgroundColor: C.surfaceDim,
    opacity: 0.4,
  },
  nextBtnText: {
    ...T.labelSm,
    fontSize: 12,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 1,
  },
  nextBtnArrow: {
    fontSize: 16,
    fontWeight: '900',
    color: C.black,
  },
});
