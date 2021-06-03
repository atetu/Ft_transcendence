export default {
  language: 'English',
  channel: {
    create: {
      _: 'Create a channel',
      action: 'create',
    },
    discover: {
      _: 'Discover some channels',
      action: 'discover',
      unlock: {
        title: 'Unlock channel access {name}',
        label: 'What is the psassword?',
      },
    },
    visibility: {
      public: 'Public',
      protected: 'Protected',
      private: 'Private',
    },
    group: {
      owner: 'Owner',
      admin: 'Admin',
      user: 'User',
      banned: 'Banned',
    },
    field: {
      name: {
        _: 'Name',
      },
      visibility: {
        _: 'Visibility',
      },
      password: {
        _: 'Password',
        'leave-empty': 'Leave empty to not modify',
      },
    },
    settings: {
      title: 'Settings of {name}',
      button: 'settings',
      danger: {
        title: 'Danger Zone',
        actions: {
          'clear-messages': {
            _: 'Clear Messages',
            confirm: 'This will remove all of the messages.',
          },
          'delete-channel': {
            _: 'Delete Channel',
            confirm:
              'This will remove the channel as well as all of its messages',
          },
        },
      },
    },
    invite: {
      title: 'Invite people to {name}',
      label: 'What is his username?',
      button: 'invite',
    },
    leave: {
      title: 'Leave channel {name}?',
      button: 'leave',
    },
    join: {
      button: 'join',
    },
    action: {
      transfer:
        'Are you sure that you want to transfer the ownership of this channel to {user}?',
      promote: 'Are you sure that you want to promote {user}?',
      demote: 'Are you sure that you want to demote {user}?',
      ban: 'Are you sure that you want to ban {user}?',
      unban: 'Are you sure that you want to unban {user}?',
      kick: 'Are you sure that you want to kick {user}?',
    },
  },
  error: {
    retry: 'retry',
  },
}
