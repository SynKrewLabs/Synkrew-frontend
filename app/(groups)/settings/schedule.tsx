/**
 * SynKrew — Task Schedule Management (Redesign — Member-Scoped)
 * Route: app/(groups)/settings/schedule.tsx
 *
 * Companion screen to Task Definition Management (§2.13/§2.13a).
 * Allows individual members to adjust their 7-day weekday schedule post-join.
 *
 * Implements:
 *   - 7 weekday dropdown rows (Mon–Sun)
 *   - Multi-select task checklist inside each day's dropdown
 *   - Blocked state when a day is left with zero tasks:
 *     Stubbed with shared ErrorBanner component.
 *   - Save schedule CTA & return to Group Settings
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Alert,
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
type DayScheduleMap = Record<DayName, string[]>;

interface MemberTask {
  id: string;
  title: string;
  frequency: string;
}

const MEMBER_TASKS_DATA: MemberTask[] = [
  { id: '1', title: '5K_OUTDOOR_RUN', frequency: 'DAILY' },
  { id: '2', title: 'READ_20_PAGES', frequency: 'DAILY' },
  { id: '3', title: 'CODE_CHALLENGE', frequency: 'WEEKLY' },
];

export default function TaskScheduleManagementScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - S.md * 2, 448);
  const params = useLocalSearchParams();

  const groupName = params.name ? String(params.name) : 'NEON KNIGHTS';

  const [schedule, setSchedule] = useState<DayScheduleMap>({
    MONDAY: ['1', '2'],
    TUESDAY: ['1'],
    WEDNESDAY: ['2', '3'],
    THURSDAY: ['1', '3'],
    FRIDAY: ['1', '2'],
    SATURDAY: ['1'],
    SUNDAY: ['2'],
  });

  const [expandedDay, setExpandedDay] = useState<DayName | null>('MONDAY');
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const toggleDayExpansion = (day: DayName) => {
    setExpandedDay(prev => (prev === day ? null : day));
  };

  const toggleTaskForDay = (day: DayName, taskId: string) => {
    const currentTasks = schedule[day] || [];
    const exists = currentTasks.includes(taskId);

    if (exists && currentTasks.length === 1) {
      // TODO: replace with final blocked-state design once Stitch screen is ready
      setScheduleError(
        `CANNOT UNCHECK LAST ROUTINE FOR ${day}: Every day requires at least 1 assigned routine to generate daily synchronization instances.`
      );
      return;
    }

    setScheduleError(null);
    const updated = exists
      ? currentTasks.filter(id => id !== taskId)
      : [...currentTasks, taskId];

    setSchedule(prev => ({
      ...prev,
      [day]: updated,
    }));
  };

  const daysWithZeroTasks = useMemo(() => {
    return DAYS_OF_WEEK.filter(day => !schedule[day] || schedule[day].length === 0);
  }, [schedule]);

  const isBlocked = daysWithZeroTasks.length > 0;

  const handleSave = () => {
    if (isBlocked) {
      // TODO: replace with final blocked-state design once Stitch screen is ready
      setScheduleError(
        `CANNOT SAVE: Zero tasks assigned to ${daysWithZeroTasks.join(', ')}. Assign at least 1 task per day.`
      );
      return;
    }

    Alert.alert(
      'SCHEDULE UPDATED',
      'Your individual routine schedule has been saved. Changes will take effect starting next active cycle.',
      [
        {
          text: 'RETURN TO SETTINGS',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[StyleSheet.absoluteFill, gridBgStyle(24, 0.08)]} pointerEvents="none" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, hardShadow(SHADOW_OFFSET), { width: cardWidth }]}>
          <TitleBar label="SCHEDULE_CONFIG.EXE" color="mint" />

          <View style={styles.body}>
            {/* Header Block (Matches companion tasks.tsx styling) */}
            <View style={styles.headerBlock}>
              <View style={styles.memberTag}>
                <Text style={styles.memberTagText}>MEMBER-SCOPED SCHEDULE</Text>
              </View>
              <Text style={styles.headline}>TASK SCHEDULE MANAGEMENT</Text>
              <Text style={styles.subtitle}>
                Adjust which routines trigger for you on each weekday in "{groupName.toUpperCase()}".
              </Text>
            </View>

            {/* Blocked State Error Banner (Stubbed per UX plan / prompt) */}
            {scheduleError && (
              // TODO: replace with final blocked-state design once Stitch screen is ready
              <ErrorBanner
                message={scheduleError}
                actionLabel="DISMISS"
                onAction={() => setScheduleError(null)}
              />
            )}

            {/* 7-Day Dropdown Stack */}
            <View testID="mgmt-schedule-stack" style={styles.daysStack}>
              {DAYS_OF_WEEK.map(day => {
                const assignedTaskIds = schedule[day] || [];
                const taskCount = assignedTaskIds.length;
                const isExpanded = expandedDay === day;
                const hasZero = taskCount === 0;

                return (
                  <View
                    key={day}
                    testID={`mgmt-day-${day.toLowerCase()}`}
                    style={[
                      styles.dayContainer,
                      hasZero && styles.dayContainerEmpty,
                      hardShadow(SHADOW_OFFSET_SM),
                    ]}
                  >
                    {/* Day Header Trigger */}
                    <Pressable
                      testID={`mgmt-day-header-${day.toLowerCase()}`}
                      style={[
                        styles.dayHeader,
                        isExpanded && styles.dayHeaderExpanded,
                        hasZero && styles.dayHeaderEmpty,
                      ]}
                      onPress={() => toggleDayExpansion(day)}
                      accessibilityRole="button"
                      accessibilityLabel={`${day}: ${taskCount} routines assigned. Tap to expand.`}
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

                    {/* Expanded Task Checklist */}
                    {isExpanded && (
                      <View style={styles.dropdownBody}>
                        <Text style={styles.dropdownPrompt}>
                          Assigned routines for {day}:
                        </Text>

                        <View style={styles.taskOptionList}>
                          {MEMBER_TASKS_DATA.map(task => {
                            const isChecked = assignedTaskIds.includes(task.id);
                            return (
                              <Pressable
                                key={task.id}
                                testID={`mgmt-task-check-${day.toLowerCase()}-${task.id}`}
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

            {/* Action Row */}
            <View style={styles.actionRow}>
              <Pressable
                testID="mgmt-schedule-btn-save"
                style={[
                  styles.saveBtn,
                  isBlocked && styles.saveBtnDisabled,
                  hardShadow(isBlocked ? 0 : SHADOW_OFFSET_SM),
                ]}
                onPress={handleSave}
                accessibilityRole="button"
              >
                <Text style={styles.saveBtnText}>💾 SAVE SCHEDULE CHANGES</Text>
              </Pressable>

              <Pressable
                testID="mgmt-schedule-btn-back"
                style={styles.backBtn}
                onPress={() => router.back()}
                accessibilityRole="button"
              >
                <Text style={styles.backBtnText}>← RETURN TO MANIFEST</Text>
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

  // Header Block
  headerBlock: {
    gap: 4,
  },
  memberTag: {
    alignSelf: 'flex-start',
    backgroundColor: C.secondaryContainer,
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
    color: '#00513a',
  },
  headline: {
    ...T.headlineMd,
    fontSize: 20,
    color: C.black,
    textTransform: 'uppercase',
  },
  subtitle: {
    ...T.bodyMd,
    fontSize: 13,
    color: C.onSurfaceVariant,
    lineHeight: 18,
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

  // Actions
  actionRow: {
    gap: S.xs,
    marginTop: S.xs,
  },
  saveBtn: {
    width: '100%',
    height: 48,
    backgroundColor: C.pink,
    borderWidth: BORDER_HEAVY,
    borderColor: C.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: C.surfaceDim,
    opacity: 0.45,
  },
  saveBtnText: {
    ...T.labelSm,
    fontSize: 12,
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
    fontSize: 11,
    fontWeight: '700',
  },
});
