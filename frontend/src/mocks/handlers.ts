import { HttpResponse, http } from 'msw';

import { workflows } from '~/config';
import { mockMindmap, mockUserId } from '.';

/**
 * Default Edifice handlers (session, theme, i18n...)
 * required by EdificeClientProvider
 */
const defaultHandlers = [
  http.get('/userbook/preference/apps', () => {
    return HttpResponse.json({
      preference: '{"bookmarks":[],"applications":["Mindmap"]}',
    });
  }),

  http.get('/userbook/api/person', () => {
    return HttpResponse.json({
      status: 'ok',
      result: [
        {
          id: mockUserId,
          login: 'fake.user',
          displayName: 'Fake User',
          type: ['Teacher'],
          visibleInfos: [],
          schools: [
            {
              exports: null,
              classes: [],
              name: 'Fake School',
              id: 'd4c3b2a1',
              UAI: null,
            },
          ],
          relatedName: null,
          relatedId: null,
          relatedType: null,
          userId: mockUserId,
          motto: '',
          photo: `/userbook/avatar/${mockUserId}`,
          mood: 'default',
          health: '',
          address: '',
          email: 'fake.user@example.com',
          tel: '',
          mobile: '',
          birthdate: '1990-01-01',
          hobbies: [],
        },
      ],
    });
  }),

  http.get('/theme', () => {
    return HttpResponse.json({
      template: '/public/template/portal.html',
      logoutCallback: '',
      skin: '/assets/themes/fake/skins/default/',
      themeName: 'fake-theme',
      skinName: 'default',
    });
  }),

  // Used by useTrashedResource
  http.get('/explorer/resources', () => {
    return HttpResponse.json({ resources: [] });
  }),

  http.get('/locale', () => {
    return HttpResponse.json({ locale: 'fr' });
  }),

  http.get(`/directory/userbook/${mockUserId}`, () => {
    return HttpResponse.json({
      mood: 'default',
      health: '',
      alertSize: false,
      storage: 12345678,
      type: 'USERBOOK',
      userid: mockUserId,
      picture: `/userbook/avatar/${mockUserId}`,
      quota: 104857600,
      motto: '',
      theme: 'default',
      hobbies: [],
    });
  }),

  http.get(`/workspace/quota/user/${mockUserId}`, () => {
    return HttpResponse.json({ quota: 104857600, storage: 12345678 });
  }),

  http.get('/auth/oauth2/userinfo', () => {
    return HttpResponse.json({
      classNames: null,
      level: '',
      login: 'fake.user',
      lastName: 'User',
      firstName: 'Fake',
      externalId: 'abcd1234-5678-90ef-ghij-klmn1234opqr',
      federated: null,
      birthDate: '1990-01-01',
      forceChangePassword: null,
      needRevalidateTerms: false,
      deletePending: false,
      username: 'fake.user',
      type: 'ENSEIGNANT',
      hasPw: true,
      functions: {},
      groupsIds: ['group1-1234567890'],
      federatedIDP: null,
      optionEnabled: [],
      userId: mockUserId,
      structures: ['d4c3b2a1'],
      structureNames: ['Fake School'],
      uai: [],
      hasApp: false,
      ignoreMFA: true,
      classes: [],
      // Mindmap workflow rights granted to the mocked user
      authorizedActions: Object.values(workflows).map((name) => ({
        name,
        displayName: name,
        type: 'SECURED_ACTION_WORKFLOW',
      })),
      apps: [
        {
          name: 'Mindmap',
          address: '/mindmap',
          icon: 'mindmap-large',
          target: '',
          displayName: 'mindmap',
          display: true,
          prefix: '/mindmap',
          casType: null,
          scope: [''],
          isExternal: false,
        },
      ],
      childrenIds: [],
      children: {},
      widgets: [],
      sessionMetadata: {},
    });
  }),

  http.get('/applications-list', () => {
    return HttpResponse.json({
      apps: [
        {
          name: 'Mindmap',
          address: '/mindmap',
          icon: 'mindmap-large',
          target: '',
          displayName: 'mindmap',
          display: true,
          prefix: '/mindmap',
          casType: null,
          scope: [''],
          isExternal: false,
        },
      ],
    });
  }),

  http.get('/assets/theme-conf.js', () => {
    return HttpResponse.json({
      overriding: [
        {
          parent: 'theme-open-ent',
          child: 'fake-theme',
          skins: ['default'],
          help: '/help-fake',
          bootstrapVersion: 'ode-bootstrap-fake',
        },
      ],
    });
  }),
];

/**
 * Mindmap API handlers
 * Override them in a test with `server.use(...)` to simulate errors
 */
const mindmapHandlers = [
  http.get('/mindmap/conf/public', () => {
    return HttpResponse.json({});
  }),

  http.get('/mindmap/:id', () => {
    return HttpResponse.json(mockMindmap);
  }),

  http.put('/mindmap/:id', () => {
    return HttpResponse.json({});
  }),

  http.post('/mindmap', () => {
    return HttpResponse.json({ _id: mockMindmap._id });
  }),
];

export const handlers = [...defaultHandlers, ...mindmapHandlers];
