import {
  SafeAreaView,
  ScrollView,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';

export default function Screen12() {
  return (
    <View>
      <Text>Screen 12</Text>
    </View>
  );
}

const COLORS = {
  background: '#F7F7F5',
  white: '#FFFFFF',
  darkGreen: '#1C3A35',
  mediumGreen: '#2D5A4F',
  lightGreen: '#E8F0EE',
  accentGreen: '#4A8C7A',
  tagBlue: '#D6E8F5',
  tagBlueText: '#2A6090',
  tagRed: '#FCE8E8',
  tagRedText: '#C0392B',
  tagPurple: '#EDE8F5',
  tagPurpleText: '#5B3A8C',
  tagPink: '#F5E8EF',
  tagPinkText: '#8C3A62',
  tagOrange: '#FFF0E6',
  tagOrangeText: '#C0621A',
  text: '#1A1A1A',
  subText: '#555555',
  lightText: '#888888',
  border: '#E5E5E0',
  progressBg: '#E5E5E0',
  progressFill: '#1C3A35',
  iconBg: '#F0F5F3',
  checkGreen: '#2D7A5A',
};

const Tag = ({ label, color, textColor }) => (
  <View style={[styles.tag, { backgroundColor: color }]}>
    <Text style={[styles.tagText, { color: textColor }]}>{label}</Text>
  </View>
);

const ProgressBar = ({ percent }) => (
  <View style={styles.progressContainer}>
    <View style={styles.progressBg}>
      <View style={[styles.progressFill, { width: `${percent}%` }]} />
    </View>
    <Text style={styles.progressLabel}>{percent}%</Text>
  </View>
);

const BenefitRow = ({ text }) => (
  <View style={styles.benefitRow}>
    <View style={styles.checkCircle}>
      <Text style={styles.checkMark}>✓</Text>
    </View>
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

const VitaminCard = ({ name, tags, benefits, reason, matchPercent }) => (
  <View style={styles.vitaminCard}>
    <View style={styles.vitaminHeader}>
      <Text style={styles.vitaminName}>{name}</Text>
      <View style={styles.tagsRow}>
        {tags.map((t, i) => (
          <Tag key={i} label={t.label} color={t.color} textColor={t.textColor} />
        ))}
      </View>
    </View>
    {benefits.map((b, i) => <BenefitRow key={i} text={b} />)}
    <View style={styles.whyBox}>
      <Text style={styles.whyTitle}>Why this is recommended</Text>
      <Text style={styles.whyText}>{reason}</Text>
    </View>
    <ProgressBar percent={matchPercent} />
  </View>
);

const vitamins = [
  {
    name: 'Vitamin D',
    tags: [
      { label: 'Energy Support', color: COLORS.tagBlue, textColor: COLORS.tagBlueText },
      { label: 'High Priority', color: COLORS.tagRed, textColor: COLORS.tagRedText },
    ],
    benefits: ['Supports immune system function', 'Enhances mood and cognitive health'],
    reason: 'Vital for maintaining stable mood during cycle shifts and combating seasonal fatigue reported in your logs.',
    matchPercent: 87,
  },
  {
    name: 'Iron',
    tags: [
      { label: 'Blood Health', color: COLORS.tagPink, textColor: COLORS.tagPinkText },
    ],
    benefits: ['Reduces tiredness and fatigue', 'Supports oxygen transport'],
    reason: 'Recommended to counteract iron loss during your upcoming period and address reported low energy levels.',
    matchPercent: 81,
  },
  {
    name: 'Magnesium',
    tags: [
      { label: 'Relaxation', color: COLORS.tagPurple, textColor: COLORS.tagPurpleText },
    ],
    benefits: ['Supports muscle and nerve function', 'Helps with sleep quality'],
    reason: 'Helps soothe potential PMS symptoms like cramping and irritability before your cycle starts.',
    matchPercent: 78,
  },
  {
    name: 'Vitamin B12',
    tags: [
      { label: 'Metabolism', color: COLORS.tagOrange, textColor: COLORS.tagOrangeText },
    ],
    benefits: ['Maintains healthy nerve cells', 'Assists in DNA production'],
    reason: 'Provides sustained energy throughout the day to help manage your reported midday fatigue.',
    matchPercent: 75,
  },
];

export default function VitaminRecommendationsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageTitle}>Vitamin Recommendations</Text>
            <Text style={styles.pageSubtitle}>Personalized wellness support designed for you</Text>
          </View>
          <TouchableOpacity style={styles.refreshBtn}>
            <Text style={styles.refreshIcon}>↻</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>PERSONALIZED FOR YOU</Text>
          </View>
          <Text style={styles.heroTitle}>Today's wellness recommendations</Text>
          <Text style={styles.heroSubtext}>
            Based on your recent tracking data and goals, we've curated specific vitamins to support your energy levels and cycle transition.
          </Text>
          <View style={styles.heroFooter}>
            <Text style={styles.heroStar}>✦</Text>
            <Text style={styles.heroFooterText}>4 Recommendations Available</Text>
          </View>
        </View>

        {/* Why Section */}
        <Text style={styles.sectionLabel}>Why these recommendations?</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Wellness{'\n'}Score</Text>
            <Text style={styles.statValue}>82%</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Primary{'\n'}Symptom</Text>
            <Text style={[styles.statValue, styles.statValueBold]}>Fatigue</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Recent{'\n'}Mood</Text>
            <Text style={[styles.statValue, styles.statValueBold]}>Tired</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Cycle{'\n'}Status</Text>
            <Text style={[styles.statValue, styles.statValueBold]}>Upcoming{'\n'}Period</Text>
          </View>
        </View>

        {/* Insight Banner */}
        <View style={styles.insightBanner}>
          <Text style={styles.insightIcon}>📍</Text>
          <Text style={styles.insightText}>
            Your wellness data indicates a higher need for magnesium and iron during your upcoming luteal phase to manage fatigue and maintain stable energy levels.
          </Text>
        </View>

        {/* Vitamins */}
        <View style={styles.vitaminSection}>
          <Text style={styles.sectionTitle}>Recommended Vitamins</Text>
          <Text style={styles.sectionSubtitle}>Each recommendation includes benefits and the reason it was selected.</Text>
          {vitamins.map((v, i) => <VitaminCard key={i} {...v} />)}
        </View>

        {/* Wellness Reminder */}
        <View style={styles.reminderCard}>
          <View style={styles.reminderIconWrap}>
            <Text style={styles.reminderIconText}>✦</Text>
          </View>
          <View style={styles.reminderTextWrap}>
            <Text style={styles.reminderTitle}>Wellness Reminder</Text>
            <Text style={styles.reminderBody}>
              The more consistently you track your symptoms and mood, the more accurate and personalized these recommendations become over time.
            </Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveIcon}>💾</Text>
          <Text style={styles.saveBtnText}>Save Recommendations</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
  },
  pageTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  pageSubtitle: { fontSize: 12, color: COLORS.lightText, marginTop: 2, maxWidth: 220 },
  refreshBtn: { padding: 4 },
  refreshIcon: { fontSize: 20, color: COLORS.accentGreen },

  heroCard: {
    backgroundColor: COLORS.darkGreen,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 22,
    marginBottom: 22,
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 14,
  },
  heroBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  heroTitle: { color: COLORS.white, fontSize: 22, fontWeight: '700', lineHeight: 28, marginBottom: 10 },
  heroSubtext: { color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 19, marginBottom: 16 },
  heroFooter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroStar: { color: COLORS.white, fontSize: 13 },
  heroFooterText: { color: COLORS.white, fontSize: 13, fontWeight: '500' },

  sectionLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text, paddingHorizontal: 18, marginBottom: 10 },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 14,
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    width: '47%',
    alignItems: 'flex-start',
  },
  statLabel: { fontSize: 12, color: COLORS.lightText, marginBottom: 4, lineHeight: 17 },
  statValue: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  statValueBold: { fontSize: 17 },

  insightBanner: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGreen,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    gap: 10,
    alignItems: 'flex-start',
  },
  insightIcon: { fontSize: 16, marginTop: 1 },
  insightText: { fontSize: 13, color: COLORS.mediumGreen, lineHeight: 19, flex: 1 },

  vitaminSection: { paddingHorizontal: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  sectionSubtitle: { fontSize: 12, color: COLORS.lightText, marginBottom: 14 },

  vitaminCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  vitaminHeader: { marginBottom: 12 },
  vitaminName: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  tagText: { fontSize: 11, fontWeight: '600' },

  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  checkCircle: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: COLORS.lightGreen,
    alignItems: 'center', justifyContent: 'center',
  },
  checkMark: { color: COLORS.checkGreen, fontSize: 10, fontWeight: '700' },
  benefitText: { fontSize: 13, color: COLORS.subText },

  whyBox: { marginTop: 12, marginBottom: 10 },
  whyTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  whyText: { fontSize: 12, color: COLORS.subText, lineHeight: 18 },

  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressBg: {
    flex: 1, height: 6, backgroundColor: COLORS.progressBg,
    borderRadius: 3, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: COLORS.progressFill, borderRadius: 3 },
  progressLabel: { fontSize: 12, fontWeight: '700', color: COLORS.text, width: 36, textAlign: 'right' },

  reminderCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.darkGreen,
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 18,
    marginTop: 8,
    gap: 14,
    alignItems: 'flex-start',
  },
  reminderIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  reminderIconText: { color: COLORS.white, fontSize: 18 },
  reminderTextWrap: { flex: 1 },
  reminderTitle: { color: COLORS.white, fontSize: 14, fontWeight: '700', marginBottom: 6 },
  reminderBody: { color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 18 },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  saveBtn: {
    backgroundColor: COLORS.darkGreen,
    borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  saveIcon: { fontSize: 16 },
  saveBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});