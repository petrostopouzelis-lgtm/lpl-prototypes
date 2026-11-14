// Puts the wording of the 2010 TEIQue 360 sample report into text/library.json.
// Everything under "pages" and every scale's short line, interpretation, scorer boxes and
// development suggestions is copied from that report, word for word. The 2010 sample only
// shows one band per scale (the band its sample person scored in), so the other bands stay empty.
// Wording written for this build (not from any LPL report) is moved to "extras" and is not shown
// unless extras are switched on.
const fs = require('fs'), path = require('path');
const file = path.join(__dirname, '..', 'text', 'library.json');
const lib = JSON.parse(fs.readFileSync(file, 'utf8'));
const SRC = 'from 2010 sample';

const pages = {
  status: 'All wording copied from the 2010 TEIQue 360 sample report.',
  section_intro: 'Introduction and background',
  section_results: 'Interpreting your results',
  about: {
    title: 'About Trait Emotional Intelligence',
    what_title: 'What is trait emotional intelligence?',
    what: ['Trait emotional intelligence (trait EI) is a grand theory of personality that integrates personality traits, emotions, and intelligence, broadly defined - hence, trait emotional intelligence. The theory has been developed by Professor K. V. Petrides and is being applied globally in industry sectors as diverse as education, entertainment, health, manufacturing, military, oil & gas, and tourism among many others.'],
    why_title: 'Why is trait emotional intelligence important?',
    why: ['We at London Psychometric Laboratory and other research teams have shown that the TEIQue™ "facets" and "factors" affect many areas of people\'s lives; home, work, personal relationships, business relationships, and mental health.',
      'Below is an indicative list of workplace outcomes, behaviours, and variables that are influenced by one or more aspects of trait EI;'],
    list: ['Career choice', 'Assessment of training needs', 'Challenging behaviour', 'Conflict resolution', 'Customer service', 'Interpersonal skills', 'Communication skills', 'Job performance',
      'Leadership Mentoring', 'Succession strategies', 'Organisational change and behaviour', 'Personal development', 'Employee counselling', 'Sales ability', 'Teambuilding', 'Turnover'],
    after: ['The above and many other areas are affected by trait EI because all of them have emotion-related components that the TEIQue™ can assess reliably and validly.',
      'Trait emotional intelligence (trait EI) is a group of emotion-related self-perceptions concerning a person’s beliefs about their emotional abilities.',
      'The theory of trait EI integrates the most powerful ideas from the fields of personality traits and emotional intelligence. Based on this unique theory, the TEIQue™ measures 15 distinct emotion-related personality traits.',
      'It is important when using any personality instrument to ensure that it accurately measures what it purports to i.e. that it is valid. There are a number of popular theories for emotional intelligence that appear to make sense but have not been validated.',
      'The TEIQue™ is underpinned by a leading international research program at the London Psychometric Laboratory under the direction of Professor K. V. Petrides']
  },
  measures: {
    title: 'What the TEIQue measures',
    index_title: 'Trait Emotional Intelligence Index',
    index: 'The trait emotional intelligence index provides a snapshot of your general emotional functioning. It is an index of your self-perceived ability to understand , process and utilise emotion-related information in your everyday life.',
    factors_title: 'Factors & Facets',
    factors: 'Below are four factors that cluster key facets together in order to provide an overview of trait emotional intelligence. Facets are specific traits of emotional intelligence.'
  },
  contents: {
    title: 'Report contents',
    paragraphs: ['This report reflects results from your recent multi-rater feedback (360) Trait Emotional Intelligence questionnaire. It is based on {norm} "norms" which means your scores are calculated by comparing your responses to the {norm} population.',
      'As you read your report, keep in mind that not all high scores are necessarily good. There are positive and negative implications for both high and low scores and these should be considered in the context of type and style of work as well as the culture or environmental setting in which work is performed.',
      'Your self perceptions will likely remain relatively stable over your life (particularly between 30-65 years). However, they can change considerably after serious life changes or in response to systematic effort on your part. It is important to recognise that the way in which you see yourself may be different to how others see you.'],
    list_title: 'Interpreting your results',
    items: [
      { t: 'Rater Groups', d: 'Rater groups include who took part in the survey, how long they have experienced working with you and their perceived level of contact with you.' },
      { t: 'Your global trait emotional intelligence result', d: 'Your reputation with raters of overall trait emotional intelligence.' },
      { t: 'Your TEIQue profile', d: 'A summary of results comparing your personal rating to the average ratings from all other raters in relation to the TEIQue profile. This chart can be used to identify key gaps in self awareness and your reputation with colleagues to act as a lens to focus on strengths and prioritise areas for development.' },
      { t: 'Factor and facets', d: 'Indication of rater group responses for each Trait Emotional Intelligence factor and facet.' },
      { t: 'Your development recommedations', d: 'Suggestions to develop emotional intelligence reputation based on the results of this report.' },
      { t: 'Your development action plan', d: 'A plan to record desired outcomes and actions to develop emotional intelligence reputation.' }
    ]
  },
  raters: {
    title: 'Rater Groups', you: 'You', role: 'Job role title', time: 'Time in role',
    all: 'All co-workers ({n} total)', line: 'known you: {years} yrs and has {contact} contact with you'
  },
  global: { title: 'Global Trait Emotional Intelligence Score', caption: 'Average Rating across All Coworkers ({n})' },
  profile: {
    title: 'Your TEIQue profile',
    paragraph: 'The profile above is designed to give you a visual representation of the four factors and fifteen facets of trait emotional intelligence as perceived by your rating group i.e. your reputation with colleagues, compared to how you rate yourself.'
  },
  independent: { short: 'These Facets are independent of the four TEIQue Factors (Well Being, Sociability, Emotionality and Self Control) but influence global trait emotional intelligence.' },
  development: { title: 'Development Suggestions' },
  plan: { title: 'Your development action plan', columns: ['Development goals/outcomes', 'Development actions', 'Timescales'] },
  ack: {
    title: 'TEIQue 360 (multi-rater feedback)',
    paragraphs: ['This multi-rater 360° report is an interpretation based on rater responses to the question items from the TEIQue on-line administration system. It will be a reflection of how you are perceived in relation to the emotional intelligence traits.'],
    notes: [
      { h: 'Author, technical and development acknowledgment', p: 'All TEIQue forms have their conceptual and psychometric basis in Petrides (2001), which lays out the foundations of the theory of trait emotional intelligence.' },
      { h: 'Acknowledgement for the 360° forms (TEIQue-360° and TEIQue-360°-S)', p: 'Petrides, K. V. (2009). Technical manual for the Trait Emotional Intelligence Questionnaires (TEIQue). London: London Psychometric Laboratory.' }
    ]
  },
  coach: { title: 'Coach Data', valid: 'This report is Valid and Interpretable.', scale: 'Scale', facets: 'Facets', raw: 'Raw Score', self: 'Self %', average: 'Average %', id: 'Participant ID', norm: 'Norm', date: 'Administration date' }
};

// scale id -> { short, band, text, low, high, dev }
const OLD = {
  global: { band: 'average', text: 'The global trait EI score provides a snapshot of your general emotional functioning. It is an index of your self-perceived ability to understand, process, and utilize emotion-related information in your everyday life. Overall, your score indicates that you are well-adjusted emotionally, although there are areas where you have deficits. It is important to remember that the global score may mask considerable discrepancies between some of the more narrow aspects of the construct. For specific details, please refer to the entries for the TEIQue subscale and factor scores.' },

  wellbeing: { short: 'The view you have of yourself and of your life circumstances.', band: 'average',
    text: 'You have an average score on the well-being factor, which suggests that you have a positive view of yourself and that you generally find life enjoyable. However, like most people, there are times when you are unhappy and pessimistic.\n\nRemember to praise yourself for your efforts and accomplishments. When you are in a negative frame of mind, do not over-generalise and avoid taking important decisions.',
    low: 'Low Scorers tend to have low self-regard and tend to be disappointed about their life as it is at present.',
    high: 'High Scorers on this factor reflect a generalised sense of well-being, extending from past achievements to future expectations. Overall, individuals with high scores feel positive, happy, and fulfilled.' },
  optimism: { short: 'Confidence and likelihood to "look on the bright side" of life.', band: 'average',
    text: 'This scale is linked to general well-being and measures how you feel about the future. Your score indicates that you are as optimistic as others. You generally feel positive about the future, although occasionally you take a gloomy perspective and fail to look on the bright side. You may consider yourself a realist, although it is not the case that you are optimistic when a situation calls for optimism and pessimistic when a situation calls for pessimism. It would be wise to seek alternative viewpoints and to avoid taking important decisions when you are in a negative frame of mind.' },
  happiness: { short: 'Pleasant emotional states, primarily directed towards the present rather than the past or future.', band: 'average',
    text: 'Your score on this scale suggests that while you are generally content and feel good about yourself, like most people, there are times when you feel blue and are overly negative about things. Although it is perfectly natural to feel down occasionally, if at any time your negative feelings become acute or persistent, you should carefully analyze the causes and contributory factors.' },
  self_esteem: { short: 'Personal success and self-confident.', band: 'average',
    text: 'Your score on this scale suggests that you have average levels of self-respect. You are as confident as most people, however, there are occasions when you doubt yourself or your achievements. This may be restricted to specific activities or areas of your life or ability.\n\nOrganisational fit: Positions or situations that are clearly defined and do not often require one to take the initiative.' },

  sociability: { short: 'The degree to which a person can handle and enjoy social interaction.', band: 'average',
    text: 'Your score on the sociability factor indicates that you are about as good as most people at socialising and relating to others. Your interpersonal skills are in the mid-range. Overall, you are assertive, but there are times, especially in unfamiliar settings, when you are unsure how to behave. Try to take advantage of opportunities for social interaction in order to enhance your people skills. Show understanding for other people\'s feelings and, if necessary, try to influence them through empathic reasoning. Practice assertive behaviour, even in circumstances when you feel less confident than usual.',
    low: 'Low Scorers believe they are unable to affect others\' emotions and are less likely to be good negotiators and networkers. They are unsure what to do or say in social situations and, as a result, they often appear shy and reserved.',
    high: 'High Scorers on the sociability factor are better at social interaction. They are good listeners and can communicate clearly and confidently with people from diverse backgrounds.' },
  emotion_management: { short: 'The influencing of other people\'s feelings.', band: 'average',
    text: 'This scale concerns your ability to manage others\' emotional states. Your score indicates that, while you can influence how others feel, the effects are likely to be modest and restricted to people you know well.\n\nOrganisational fit: Positions or situations where it is beneficial, albeit not essential, to handle other people\'s feelings (e.g., front-office posts, call centres).' },
  assertiveness: { short: 'Forthright, frank, and willing to stand up for their rights.', band: 'average',
    text: 'Your score indicates that you have average levels of assertiveness. While in most cases you will stand up for your rights and beliefs, there are times when you prefer to back down even though you know you are right. Given that you are not always at ease with behaving assertively, it is important that you "choose your fights" carefully, so that you do not find yourself giving way when you shouldn\'t.' },
  social_awareness: { short: 'Ability to network and social skills.', band: 'average',
    text: 'Your score on this scale was average. Although you generally feel comfortable in social contexts, there are times when you are unsure about how to behave in the presence of people you do not know well. Even though you are about as sociable as others, it is worth making an effort to improve your people skills (e.g., by engaging in active listening, asking and giving help), as this can enhance both your personal and your work relationships.' },

  emotionality: { short: 'Ability to recognise internal emotional states and to express personal feelings to others.', band: 'average',
    text: 'You have an average score on the emotionality factor, which suggests that you are as good as most at understanding and utilising emotion-related information. Although sometimes you are insensitive to the feelings and needs of those close to you, your personal life is fulfilling. Make an effort to improve your listening skills and to understand other people\'s viewpoints, especially when you are locked in disagreements. Try to enhance your ability to perceive emotion-related information by starting to monitor your own mood.',
    low: 'Low Scorers on this factor find it difficult to recognise their internal emotional states and to express their feelings to others, which may lead to less rewarding personal relationships.',
    high: 'High Scorers on this factor are in touch with their own and other people\'s feelings. They can perceive and express emotions and use these qualities to develop and sustain close relationships with important others.' },
  empathy: { short: 'Acknowledging and taking in someone else\'s perspective.', band: 'low',
    text: 'You typically find it difficult to understand other people\'s emotions, views, and needs. You may be perceived as someone who argues in discussions and conversations until your opinion prevails. Being intransigent or unwilling to understand the perspectives of others is a serious drawback in negotiation contexts. Furthermore, insisting on getting your point across indiscriminately may cause others to unite against the position you promote.\n\nOrganisational fit: Positions or situations that require firm decision-making without regard to emotional considerations (e.g., enforcement of change in the face of stiff resistance).',
    dev: [
      { heading: 'UNDERSTANDING DOES NOT REQUIRE AGREEMENT', body: 'You may have problems accepting the reactions and behaviours of others because you do not take their perspectives into account. Or you may fear that understanding and empathizing with others\' viewpoints will signify that you agree with them. To avoid this, keep the focus on yourself. Because being empathetic is not the same as endorsing the thoughts or actions of others. Make an effort to understand what prompted others to exhibit the behaviours that you find dismaying. Simply understanding the difficulties others face may dissolve your urge to judge them and thus promote empathy. Also, remind yourself that everyone interprets situations uniquely, which means that the feelings and behaviours that follow from these interpretations will be diverse. This is part of the human condition and your effort to understand others can enhance your humanity.' },
      { heading: 'PERCEIVED AS COLD AND INSENSITIVE', body: 'Others may believe that you do not care about personal issues, and so perceive you as cold and insensitive. Such a perception can be especially damaging in the workplace where considering others\' needs and opinions is essential, especially if you hold a management position. Start by asking questions about other people\'s interests. Avoid judging their opinions or needs. In collaborative situations, always allow time for people to express their wishes. Make sure that your focus on the organisation\'s procedures and goals is balanced by an ongoing demonstration of interest in people and their issues. Keep in mind that paying attention to individuals in the workplace could enhance their motivation and thus positively affect common welfare.' },
      { heading: 'LACK OF KNOWLEDGE', body: 'You may fail to demonstrate empathy because you simply don\'t know how. If that\'s the case, here are some useful first steps. First, listen. Without interrupting, listen attentively to whatever the other person wishes to express. Use verbal and nonverbal signals to demonstrate your interest. Next, explore the issue they have brought up by asking relevant questions to clarify details and themes, and encourage them to open up more. Attempt to rephrase what they have said by capturing the essence of their thoughts in a summary. Use \'I\' phrases which demonstrate empathy, such as, "I can imagine that would make you feel disappointed and sad." If you do not agree with them, or are facing a conflict situation, you can state things in a manner that emphasises the relativity of their perception. For example, "If you perceived that this is what happened, then I understand why you would feel so upset." This creates an opportunity for you to subsequently express your view of events. Even if you disagree with both their thoughts and behaviour, when people receive this kind of feedback they feel listened to and understood.' }
    ] },
  emotion_perception: { short: 'Insightful and clear about personal and the feelings of others.', band: 'average',
    text: 'You have an average ability to understand yours and other people\'s feelings. Your score on this scale indicates that there are times when you feel emotionally confused and unable to decode other people\'s emotional signals.\n\nOrganisational fit: Positions or situations where emotion perception will facilitate desired outcomes, but is not an essential ingredient for success (e.g., negotiating from a powerful position or providing performance appraisals).' },
  emotion_expression: { short: 'Communication of personal feelings to others.', band: 'low',
    text: 'You usually find it hard to express your emotions and to communicate how you feel. You run the danger of appearing cold and aloof to your colleagues and subordinates. However, an advantage of a low score on this scale is that others cannot easily "see through" you.\n\nOrganisational fit: Positions or situations that require a high level of detachment (e.g., breaking bad news, hard-nosed negotiations). It can be difficult to keep others motivated if you are perceived as emotionally cold or uninvolved.',
    dev: [
      { heading: 'DO NOT KNOW HOW TO EXPRESS FEELINGS', body: 'Your difficulty expressing emotions may simply be due to the fact that you do not know how. You may have grown up in a household or come from a culture where emotional expression is not encouraged. As a result, the prospect of displaying feelings may provoke anxiety in you and make you feel uncomfortable. There are many ways to express emotions, including verbal and facial expressions or body language. Learning how to express feelings will improve your communication skills and help others to understand and empathise with you. Perhaps the easiest way to communicate feelings for someone who has difficulty with self-expression is through action. For example, buying flowers for someone, writing them a letter, or giving them a hug if appropriate. Observe how others, whether in real life or in movie dramas, use facial expressions, postures and gestures to convey emotion. Increase your repertoire of nonverbal modes of expression. Before using any such modes, however, make sure they are consistent with your authentic feelings.' },
      { heading: 'FEAR OF LOSING RESPECT', body: 'Sometimes people fear that if they show their emotions they will lose the respect of others, or even be humiliated. Rather than reducing your credibility, the appropriate communication of feelings may lead others to perceive you as forthright and powerful. The ability to express feelings conveys to others a sense of psychological security and self-acceptance. In addition, the expression of appropriate levels of feeling when your goal is to motivate, persuade or convince others strengthens your presentation and enhances the message' },
      { heading: 'PERCEPTION OF INSENSITIVITY', body: 'When you do not express your feelings, people may get the wrong impression and perceive you as numb, cold, and apathetic. Take baby steps in communicating your feelings. For example, show gratitude for a favour, or congratulate a colleague for a task well done. Expressing gratitude, admiration and congratulations to others can help strengthen bonds with them. In the context of closer relationships, it will be easier to find the courage to begin expressing your feelings more openly.' }
    ] },
  relationships: { short: 'Capability to have fulfilling personal relationships.', band: 'average',
    text: 'Your score on this scale suggests that you are average in your ability to forge and sustain fulfilling personal relationships in and out of work. You may occasionally experience friction that interferes with your productivity and overall wellbeing.' },

  self_control: { short: 'Personal control over urges, desires and impulses. Regulating external pressures and stress.', band: 'average',
    text: 'Your score on this factor suggests that you have average self-control. Like most people, you have a certain degree of control over your impulses and emotional reactions, but there are times when you get unduly anxious, rash, or angry. Although you like thinking things through, you occasionally take sudden, rushed decisions that you later regret. You may benefit from developing new strategies to enhance your ability to control your thoughts, actions, and feelings. For example, you could delay important decisions for a few days in order to avoid making rash judgments. When you get upset, try to transform your frustration into constructive energy.',
    low: 'Low Scorers are prone to impulsive behaviour and may find it difficult to manage stress.',
    high: 'High Scorers have a healthy degree of control over their urges and desires. In addition to controlling impulses, they are good at regulating external pressures and stress. They are neither repressed nor overly expressive.' },
  emotion_regulation: { short: 'Short, medium and long term control of one\'s own feelings and emotional states.', band: 'average',
    text: 'You are average in your ability to regulate your emotions. While you are able to stay focused and remain calm in upsetting situations, you sometimes fail to control your feelings and suffer negative thoughts, disruptive emotions, and outbursts of anger. You should try to minimize emotional outbursts, especially in the presence of people who do not know you well. However, sporadic flare-ups can, under certain circumstances, help you get a point across.' },
  impulse_control: { short: 'How reflective and the likelihood of giving-in to urges.', band: 'average',
    text: 'This scale is about doing things quickly and on the spur of the moment. You have an average score, which suggests that, although you generally think carefully before you act, there are occasions when you give in to your urges or take hasty decisions. Try to channel your impulsivity to minor issues and allocate more time to significant decisions. It will be useful to prioritise your decision-making in order to allocate more time to the more important issues. It is important to make an effort to channel your impulsivity to issues of low importance.' },
  stress_management: { short: 'Capability to withstand pressure and regulate stress.', band: 'average',
    text: 'Like most, you are capable of handling pressure much of the time, although there are occasions when you get overly stressed and anxious. Even though you generally handle stress effectively, it would be helpful to identify persistent stressors in your environment and adjust your reaction to them to moderate their impact.' },

  self_motivation: { short: 'Drive and endurance in the face of adversity.', band: 'high',
    text: 'You have a strong need for achievement and are driven by a desire to produce high quality work. You do not need to be externally rewarded for your efforts because you are motivated from within. You are more likely than most to be a self-starter. You must be careful how you use your time. Because you get satisfaction from doing things well, you risk allocating disproportionate amounts of time and effort into tasks that are not really important. It may also be difficult for you to maintain an adequate work-life balance.\n\nOrganisational fit: Positions or situations where rewards are not immediate or clearly defined or where there is little external pressure and supervision; in complex projects that require considerable time to complete.',
    low: 'Low Scorers tend to need a lot of incentives and encouragement in order to get things done. They need constant reward to keep going and they are more likely to give up in the face of adversity. They also tend to have reduced levels of drive and persistence.',
    high: 'High Scorers on this scale are driven by a need to produce high-quality work. They tend to be determined and persevering. They do not need to be externally rewarded for their efforts because they have a strong sense of achievement and are motivated from within.',
    dev: [
      { heading: 'CRITICAL OF OTHERS', body: 'Excessive self-motivation may entail a critical attitude toward the work of others, since frequently they cannot match your performance level. This could damage relationships with colleagues and undermine team efforts. Self-motivation is certainly helpful, but must be used constructively. If you feel the urge to criticize the work of others because it doesn\'t reach your own standards, keep in mind that everyone is different and may work in different ways. Review your expectations of others to see if they are realistic, and try to empathise with their personal situations. Show trust in them by giving them responsibilities and delegating work, which will also help contain your own workload.' },
      { heading: 'CLOSED TO FEEDBACK', body: 'Because your own opinion is what matters most to you, you may disregard or deprecate the comments of others regarding your work. Keep in mind that no one knows everything, and your own work may well benefit from the comments of someone with a fresher, more objective, or simply different viewpoint. In many workplaces where decisions and planning processes are carried out collectively, it is virtually impossible to avoid the opinions and judgments of others. It is an advantage to be able to take such opinions and judgments on board, irrespective of whether they have been proposed by people who are clearly less committed than you are.' },
      { heading: 'NEGLECT OF OTHER AREAS OF LIFE', body: 'If you are over-committed to a single area of your life, bear in mind you could be neglecting several others. Commonly, if you are extremely dedicated to your work, you may overlook social or personal relationships. Do not hesitate to ask friends and family about whether they think you dedicate enough time and attention to them. Use that information as you reflect upon your priorities, and the energy you invest in the different areas of your life. You may have to lessen your goals or re-align them in order to preserve or create new options. Better time management skills may bring more balance in your life.' },
      { heading: 'UNREALISTIC EXPECTATIONS OF YOURSELF', body: 'Your high levels of motivation may lead you to create unrealistic expectations of your performance. Avoiding over-committing and perfectionism is important in individuals with high motivation, especially when it is intrinsic. Being sought after or overloaded at work is often a sign of the value and relative dearth in the skill set you possess. If you feel unable to reduce your workload, this may be a good time to negotiate a better reimbursement deal for yourself.' }
    ] },
  adaptability: { short: 'Flexibility and willingness to adapt to new conditions.', band: 'average',
    text: 'Your score suggests that you are as flexible as most, with an average ability to adjust to new environments and ideas. However, like others, you have attitudes and habits that you find difficult to change.\n\nOrganisational fit: Positions or situations with relatively stable workloads that occasionally involve modest changes',
    low: 'Low Scorers are change-resistant and find it difficult to modify their work- and life-style. They are generally inflexible and have fixed ideas and views.',
    high: 'High Scorers are flexible in their approach to work and life. They are willing and able to adapt to new environments and conditions - in fact, they may even enjoy novelty and regular change.' }
};

for (const [id, o] of Object.entries(OLD)) {
  const s = lib.scales[id];
  if (!s) throw new Error('unknown scale ' + id);
  s.short = o.short || '';
  s.interpretation = { low: '', average: '', high: '' };
  s.interpretation[o.band] = o.text;
  s.low_scorers = o.low || '';
  s.high_scorers = o.high || '';
  s.development = { low: [], high: [] };
  if (o.dev) s.development[o.band] = o.dev;
  const missing = ['low', 'average', 'high'].filter(b => b !== o.band);
  s.status = {
    short: o.short ? SRC : 'none in the 2010 report',
    interpretation: `${o.band} band ${SRC}; ${missing.join(' and ')} bands needed`,
    development: o.dev ? `${o.band} band ${SRC}; other band needed` : 'needed for the low and high bands (not shown in the 2010 sample)',
    definition: 'from 2025 sample; not shown in the 360 report'
  };
}

// wording written for this build: kept for later, shown only when extras are on
const old = lib.pages || {}, prev = lib.extras || {};
lib.extras = {
  status: 'Draft wording written for this build, not from any LPL report. Not shown unless extras are switched on.',
  summary: prev.summary || old.summary, map: prev.map || old.map, gap: prev.gap || old.gap,
  comparison: prev.comparison || lib.comparison
};
delete lib.comparison;
lib.pages = pages;
lib.schema = 'teique-360-text/2';
lib.notes = 'Page wording, interpretations, scorer boxes and development suggestions are copied from the 2010 TEIQue 360 sample report. '
  + 'That sample shows one band per scale, so the other bands are empty and show as "Text needed". '
  + 'Each scale also keeps the 2025 definition (lead, definition); the 360 report does not show it.';
fs.writeFileSync(file, JSON.stringify(lib, null, 2) + '\n');
const filled = Object.values(lib.scales).reduce((n, s) => n + ['low', 'average', 'high'].filter(b => s.interpretation[b]).length, 0);
console.log(`library updated: ${filled} of ${Object.keys(lib.scales).length * 3} interpretation texts filled`);
