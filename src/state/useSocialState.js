import { useState } from 'react';
import { topics } from '../data/content';

// Lives above the screens so comments and groups survive leaving the social page.
export function useSocialState() {
  const [socialTab, setSocialTab] = useState('topics');
  const [activeTopic, setActiveTopic] = useState(null);
  const [topicData, setTopicData] = useState(topics);
  const [comment, setComment] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [friends] = useState([]);
  const [inviteCode] = useState('PLAY2026');

  return {
    socialTab, setSocialTab, activeTopic, setActiveTopic, topicData, setTopicData,
    comment, setComment, anonymous, setAnonymous, groups, setGroups,
    groupName, setGroupName, friends, inviteCode,
  };
}
