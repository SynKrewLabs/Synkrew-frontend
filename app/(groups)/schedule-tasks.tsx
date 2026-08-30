/**
 * SynKrew — Schedule Tasks (Shared Screen — 7-Day Dropdown Redesign)
 * Route: app/(groups)/schedule-tasks.tsx
 *
 * Used by BOTH Create Group (Entry Point 1) and Join Group (Entry Point 2).
 * Allows the user (creator or joining member) to assign their defined tasks
 * across each of the 7 weekdays using the new stacked dropdown mechanic.
 *
 * Implements:
 *   - 7 weekday accordion/dropdown rows (Mon–Sun)
 *   - Multi-select task checklist inside each day's dropdown
 *   - Summary pill on collapsed rows (e.g. '2 SELECTED' / 'NO TASKS')
 *   - Blocked state when ANY day has 0 tasks checked (Next button disabled + warning banner)
 *   - Dynamic navigation: routes to Step 3 in Create mode, or Confirmation in Join mode
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
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
import { TaskDefinition } from './define-tasks';

const DAYS_OF_WEEK = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const;

type DayName = (typeof DAYS_OF_WEEK)[number];

type DayScheduleMap = Record<DayName, string[]>; // day -> array of task IDs

const DEFAULT_TASKS_FALLBACK: TaskDefinition[] = [
  { id: 'task_1', title: 'MORNING RUN 5K', frequency: 'DAILY', target: 1 },
  { id: 'task_2', title: 'MEDITATION 15M', frequency: 'DAILY', target: 1 },
  { id: 'task_3', title: 'CODE SPRINT 1HR', frequency: 'DAILY', target: 1 },
];

export default function ScheduleTasksScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);
  const params = useLocalSearchParams();

  const mode = (params.mode as string) || (params.name && !params.inviter ? 'create' : 'join');
  const isCreateMode = mode === 'create';

  // Parse tasks passed from define-tasks
  const userTasks: TaskDefinition[] = useMemo(() => {
    if (params.tasksData) {
      try {
        const parsed = JSON.parse(String(params.tasksData));
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // Fallback below
      }
    }
    return DEFAULT_TASKS_FALLBACK;
  }, [params.tasksData]);

  // Initial schedule: assign first 1-2 tasks to all days by default so user has a clean starting point
  const [schedule, setSchedule] = useState<DayScheduleMap>(() => {
    const initial: Partial<DayScheduleMap> = {};
    DAYS_OF_WEEK.forEach(day => {
      // Default: check all available tasks for weekdays, first task for weekends
      initial[day] = userTasks.slice(0, day === 'SATURDAY' || day === 'SUNDAY' ? 1 : 2).map(t => t.id);
    });
    return initial as DayScheduleMap;
  });

  // Track expanded day (default Monday open)
  const [expandedDay, setExpandedDay] = useState<DayName | null>('MONDAY');

  const toggleDayExpansion = (day: DayName) => {
    setExpandedDay(prev => (prev === day ? null : day));
  };

  const toggleTaskForDay = (day: DayName, taskId: string) => {
    setSchedule(prev => {
      const currentTasks = prev[day] || [];
      const exists = currentTasks.includes(taskId);
      const updated = exists
        ? currentTasks.filter(id => id !== taskId)
        : [...currentTasks, taskId];

      return {
        ...prev,
        [day]: updated,
      };
    });
  };

  // Find any days with 0 tasks
  const daysWithZeroTasks = useMemo(() => {
    return DAYS_OF_WEEK.filter(day => !schedule[day] || schedule[day].length === 0);
  }, [schedule]);

  const isBlocked = daysWithZeroTasks.length > 0;

  const handleNext = () => {
    if (isBlocked) return;

    if (isCreateMode) {
      router.push({
        pathname: '/(groups)/create/step-3',
        params: {
          ...params,
          mode,
          scheduleData: JSON.stringify(schedule),
        },
      });
    } else {
      router.push({
        pathname: '/(groups)/join/confirmation',
        params: {
          ...params,
          mode,
          scheduleData: JSON.stringify(schedule),
        },
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="SCHEDULER.EXE" color="mint" />

          <View style={styles.body}>
            {/* Step header */}
            <View style={styles.stepHeader}>
              <View style={styles.stepLabelRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>
                    {isCreateMode ? 'STEP 3 OF 5' : 'STEP 2 OF 2'}
                  </Text>
                </View>
                <Text style={styles.stepContext}>
                  {isCreateMode ? 'CREATE PACT' : 'JOIN PACT'}
                </Text>
              </View>
              {/* Progress bar */}
              <View style={styles.progressBar}>
                <View style={[styles.progressSegment, styles.progressFilled]} />
                <View style={[styles.progressSegment, styles.progressFilled]} />
                {isCreateMode ? (
                  <>
                    <View style={[styles.progressSegment, styles.progressFilled]} />
                    <View style={styles.progressSegment} />
                    <View style={styles.progressSegment} />
                  </>
                ) : null}
              </View>
            </View>

            {/* Title Block */}
            <View style={styles.titleBlock}>
              <Text style={styles.headline}>SCHEDULE TASKS</Text>
              <Text style={styles.subtitle}>
                Assign which routines are active on each day. Every day must have ≥1 task scheduled.
              </Text>
            </View>

            {/* Blocked State Banner (when ANY day has 0 tasks) */}
            {isBlocked && (
              <View testID="schedule-blocked-banner" style={[styles.blockedBanner, hardShadow(SHADOW_OFFSET_SM)]}>
                <Text style={styles.blockedIcon}>⚠️</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.blockedTitle}>INCOMPLETE SCHEDULE DETECTED</Text>
                  <Text style={styles.blockedText}>
                    Zero tasks assigned to:{' '}
                    <Text style={{ fontWeight: '900', color: '#ba1a1a' }}>
                      {daysWithZeroTasks.join(', ')}
                    </Text>
                    . Assign at least 1 routine per day to proceed.
                  </Text>
                </View>
              </View>
            )}

            {/* 7-Day Dropdown Stack */}
            <View testID="schedule-days-stack" style={styles.daysStack}>
              {DAYS_OF_WEEK.map(day => {
                const assignedTaskIds = schedule[day] || [];
                const taskCount = assignedTaskIds.length;
                const isExpanded = expandedDay === day;
                const hasZero = taskCount === 0;

                return (
                  <View
                    key={day}
                    testID={`schedule-day-${day.toLowerCase()}`}
                    style={[
                      styles.dayContainer,
                      hasZero && styles.dayContainerEmpty,
                      hardShadow(SHADOW_OFFSET_SM),
                    ]}
                  >
                    {/* Day Header (Dropdown Trigger) */}
                    <Pressable
                      testID={`day-header-${day.toLowerCase()}`}
                      style={[
                        styles.dayHeader,
                        isExpanded && styles.dayHeaderExpanded,
                        hasZero && styles.dayHeaderEmpty,
                      ]}
                      onPress={() => toggleDayExpansion(day)}
                      accessibilityRole="button"
                      accessibilityLabel={`${day}: ${taskCount} tasks assigned. Tap to expand.`}
                    >
                      <View style={styles.dayNameRow}>
                        <View style={[styles.dayDot, hasZero ? styles.dayDotEmpty : styles.dayDotFilled]} />
                        <Text style={styles.dayNameText}>{day}</Text>
                      </View>

                      <View style={styles.dayHeaderRight}>
                        <View
                          style={[
                            styles.countPill,
                            hasZero ? styles.countPillEmpty : styles.countPillFilled,
                          ]}
                        >
                          <Text
                            style={[
                              styles.countPillText,
                              hasZero ? styles.countPillTextEmpty : styles.countPillTextFilled,
                            ]}
                          >
                            {hasZero ? 'NO TASKS' : `${taskCount} SELECTED`}
                          </Text>
                        </View>
                        <Text style={styles.chevronIcon}>
                          {isExpanded ? '▲' : '▼'}
                        </Text>
                      </View>
                    </Pressable>

                    {/* Expanded Task Checklist Content */}
                    {isExpanded && (
                      <View style={styles.dropdownBody}>
                        <Text style={styles.dropdownPrompt}>
                          Select routines for {day}:
                        </Text>

                        <View style={styles.taskOptionList}>
                          {userTasks.map(task => {
                            const isChecked = assignedTaskIds.includes(task.id);
                            return (
                              <Pressable
                                key={task.id}
                                testID={`task-check-${day.toLowerCase()}-${task.id}`}
                                style={[
                                  styles.taskOptionRow,
                                  isChecked && styles.taskOptionRowChecked,
                                  hardShadow(1),
                                ]}
                                onPress={() => toggleTaskForDay(day, task.id)}
                                accessibilityRole="checkbox"
                                accessibilityState={{ checked: isChecked }}
                              >
                                <View style={styles.taskOptionLeft}>
                                  <Text style={styles.taskOptionTitle}>{task.title}</Text>
                                  <View style={styles.taskOptionFreqBadge}>
                                    <Text style={styles.taskOptionFreqText}>{task.frequency}</Text>
                                  </View>
                                </View>

                                <View
                                  style={[
                                    styles.checkboxBox,
                                    isChecked && styles.checkboxBoxChecked,
                                  ]}
                                >
                                  {isChecked && (
                                    <Text style={styles.checkboxCheckmark}>✓</Text>
                                  )}
                                </View>
                              </Pressable>
                            );
                          })}
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Bottom Action Row */}
            <View style={styles.actionRow}>
              <Pressable
                testID="schedule-btn-back"
                style={styles.backBtn}
                onPress={handleBack}
                accessibilityRole="button"
              >
                <Text style={styles.backBtnText}>BACK</Text>
              </Pressable>

              <Pressable
                testID="schedule-btn-next"
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
                  {isBlocked ? 'BLOCKED' : isCreateMode ? 'NEXT STEP' : 'JOIN PACT'}
                </Text>
                <Text style={styles.nextBtnArrow}>→</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
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

  // Days Stack
  daysStack: {
    gap: 8,
  },
  dayContainer: {
    backgroundColor: C.white,
    borderWidth: BORDER,
    borderColor: C.black,
    overflow: 'hidden',
  },
  dayContainerEmpty: {
    borderColor: '#ba1a1a',
    backgroundColor: '#fff5f5',
  },
  dayHeader: {
    paddingHorizontal: S.md,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: C.surfaceContainerLowest,
  },
  dayHeaderExpanded: {
    backgroundColor: C.secondaryContainer,
    borderBottomWidth: BORDER,
    borderBottomColor: C.black,
  },
  dayHeaderEmpty: {
    backgroundColor: '#ffdad6',
  },
  dayNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: C.black,
  },
  dayDotFilled: {
    backgroundColor: C.mint,
  },
  dayDotEmpty: {
    backgroundColor: C.error,
  },
  dayNameText: {
    ...T.labelSm,
    fontSize: 12,
    color: C.black,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  dayHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countPill: {
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countPillFilled: {
    backgroundColor: C.surfaceContainerHigh,
  },
  countPillEmpty: {
    backgroundColor: '#ffdad6',
    borderColor: '#ba1a1a',
  },
  countPillText: {
    ...T.labelXs,
    fontSize: 9,
    fontWeight: '800',
  },
  countPillTextFilled: {
    color: C.black,
  },
  countPillTextEmpty: {
    color: '#ba1a1a',
    fontWeight: '900',
  },
  chevronIcon: {
    fontSize: 10,
    fontWeight: '900',
    color: C.black,
  },

  // Dropdown Body
  dropdownBody: {
    backgroundColor: C.surface,
    padding: S.md,
    gap: 8,
  },
  dropdownPrompt: {
    ...T.labelXs,
    fontSize: 10,
    color: C.onSurfaceVariant,
    fontWeight: '800',
  },
  taskOptionList: {
    gap: 6,
  },
  taskOptionRow: {
    backgroundColor: C.white,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    paddingHorizontal: S.sm,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskOptionRowChecked: {
    backgroundColor: C.secondaryContainer,
  },
  taskOptionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskOptionTitle: {
    ...T.labelSm,
    fontSize: 12,
    color: C.black,
    fontWeight: '900',
  },
  taskOptionFreqBadge: {
    backgroundColor: C.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: C.black,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  taskOptionFreqText: {
    ...T.labelXs,
    fontSize: 8,
    color: C.black,
    fontWeight: '900',
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderWidth: BORDER_THIN,
    borderColor: C.black,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: C.pink,
  },
  checkboxCheckmark: {
    fontSize: 13,
    fontWeight: '900',
    color: C.black,
  },

  // Action Row
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
