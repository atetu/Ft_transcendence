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
  },
  error: {
    retry: 'retry',
  },
}
