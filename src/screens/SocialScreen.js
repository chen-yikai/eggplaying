import React from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../theme/styles';

export default function SocialScreen({ language, t, switchLanguage, goHome, social }) {
  const {
    socialTab, setSocialTab, activeTopic, setActiveTopic, topicData, setTopicData,
    comment, setComment, anonymous, setAnonymous, groups, setGroups,
    groupName, setGroupName, friends, inviteCode,
  } = social;

  const selectedTopic = topicData.find(
    item => item.id === activeTopic
  );

  const addComment = () => {
    if (!comment.trim() || !selectedTopic) return;

    setTopicData(old =>
      old.map(item =>
        item.id === activeTopic
          ? {
              ...item,
              comments: [
                ...item.comments,
                { text: comment.trim(), anonymous },
              ],
            }
          : item
      )
    );

    setComment('');
  };

  const createNewGroup = () => {
    if (!groupName.trim()) return;

    setGroups(old => [...old, groupName.trim()]);
    setGroupName('');

    Alert.alert(
      language === 'zh' ? '建立成功' : 'Created',
      language === 'zh' ? '群組已建立！' : 'Your group has been created!'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {switchLanguage}

        <TouchableOpacity onPress={goHome}>
          <Text style={styles.backText}>{t.back}</Text>
        </TouchableOpacity>

        <Text style={styles.logo}>
          💬 {language === 'zh' ? '話題交流' : 'Social Hub'}
        </Text>

        <Text style={styles.subtitle}>
          {language === 'zh'
            ? '分享想法，認識更多朋友！'
            : 'Share ideas and meet new friends!'}
        </Text>

        <View style={styles.tabRow}>
          {[
            ['topics', t.discussion],
            ['friends', t.friends],
            ['groups', t.groups],
          ].map(([id, label]) => (
            <TouchableOpacity
              key={id}
              onPress={() => setSocialTab(id)}
              style={[
                styles.tab,
                socialTab === id && styles.activeTab,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  socialTab === id && styles.activeTabText,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {socialTab === 'topics' && !selectedTopic && (
          <>
            <Text style={styles.sectionTitle}>
              {language === 'zh' ? '今日話題' : "Today's Topics"}
            </Text>

            {topicData.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.topicCard}
                onPress={() => setActiveTopic(item.id)}
              >
                <Text style={styles.topicLabel}>
                  {language === 'zh' ? '熱門話題' : 'TOPIC'}
                </Text>
                <Text style={styles.topicTitle}>
                  {language === 'zh' ? item.zh : item.en}
                </Text>
                <Text style={styles.commentCount}>
                  {item.comments.length} {t.comments} →
                </Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {socialTab === 'topics' && selectedTopic && (
          <>
            <TouchableOpacity onPress={() => setActiveTopic(null)}>
              <Text style={styles.backText}>
                {language === 'zh' ? '← 返回話題' : '← Back to Topics'}
              </Text>
            </TouchableOpacity>

            <View style={styles.topicCard}>
              <Text style={styles.topicTitle}>
                {language === 'zh'
                  ? selectedTopic.zh
                  : selectedTopic.en}
              </Text>
            </View>

            <Text style={styles.sectionTitle}>
              {language === 'zh' ? '留言區' : 'Comments'}
            </Text>

            {selectedTopic.comments.map((item, index) => (
              <View key={index} style={styles.commentCard}>
                <Text style={styles.commentName}>
                  {item.anonymous
                    ? (language === 'zh' ? '匿名使用者' : 'Anonymous')
                    : (language === 'zh' ? '使用者' : 'User')}
                </Text>
                <Text style={styles.commentText}>{item.text}</Text>
              </View>
            ))}

            <View style={styles.commentInputArea}>
              <TextInput
                style={styles.input}
                value={comment}
                onChangeText={setComment}
                placeholder={t.placeholder}
                multiline
              />

              <TouchableOpacity
                style={styles.anonymousRow}
                onPress={() => setAnonymous(!anonymous)}
              >
                <Text style={styles.checkbox}>
                  {anonymous ? '☑' : '☐'}
                </Text>
                <Text>{t.anonymous}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={addComment}
              >
                <Text style={styles.confirmText}>{t.send}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {socialTab === 'friends' && (
          <>
            <View style={styles.topicCard}>
              <Text style={styles.topicTitle}>🔗 {t.invite}</Text>
              <Text style={styles.subtitle}>{t.inviteDesc}</Text>
              <Text style={styles.inviteCode}>{inviteCode}</Text>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => Alert.alert(
                  language === 'zh' ? '邀請碼' : 'Invite Code',
                  language === 'zh'
                    ? '這是示範邀請碼，正式版需要串接好友系統。'
                    : 'Demo invite code. A real friend system is needed.'
                )}
              >
                <Text style={styles.confirmText}>{t.copyCode}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>{t.friends}</Text>

            {friends.length === 0 ? (
              <Text style={styles.emptyText}>{t.noFriends}</Text>
            ) : (
              friends.map((friend, index) => (
                <View key={index} style={styles.commentCard}>
                  <Text>{'👤 ' + friend}</Text>
                </View>
              ))
            )}
          </>
        )}

        {socialTab === 'groups' && (
          <>
            <Text style={styles.sectionTitle}>{t.createGroup}</Text>

            <TextInput
              style={styles.input}
              value={groupName}
              onChangeText={setGroupName}
              placeholder={t.groupName}
            />

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={createNewGroup}
            >
              <Text style={styles.confirmText}>{t.create}</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>{t.groups}</Text>

            {groups.length === 0 ? (
              <Text style={styles.emptyText}>{t.noGroups}</Text>
            ) : (
              groups.map((group, index) => (
                <View key={index} style={styles.commentCard}>
                  <Text style={styles.cardTitle}>👥 {group}</Text>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
