import {RouteInfo} from './second-navbar.metadata';

export const ROUTES: RouteInfo[] = [

  {
    path: '/home',
    title: 'Tableau de bord',
    icon: '',
    clazz: 'nav-item',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    isNavHeader: false,
    submenu: []
  },
  {
    path: '',
    title: 'Mes services',
    icon: '',
    clazz: 'nav-item has-sub',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    isNavHeader: false,
    submenu: [
      {
        path: '/services/claim-requests',
        title: 'Réclamations',
        icon: '',
        clazz: 'menu-item',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        isNavHeader: false,
        submenu: []
      },
      {
        path: '/services/subscription-requests',
        title: 'Demandes d\'abonnements',
        icon: '',
        clazz: 'menu-item',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        isNavHeader: false,
        submenu: []
      },
      {
        path: '/services/cancellation-requests',
        title: 'Demandes de résiliation',
        icon: '',
        clazz: 'menu-item',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        isNavHeader: false,
        submenu: []
      },
      {
        path: '/services/online-payment',
        title: 'Paiement en ligne',
        icon: '',
        clazz: 'menu-item',
        badge: '',
        badgeClass: '',
        isExternalLink: false,
        isNavHeader: false,
        submenu: []
      },
    ]
  },
  {
    path: '/contracts',
    title: 'Mes contrats',
    icon: '',
    clazz: 'nav-item',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    isNavHeader: false,
    submenu: []
  },
  {
    path: '/unpaid',
    title: 'Mes impayés',
    icon: '',
    clazz: 'nav-item',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    isNavHeader: false,
    submenu: []
  },
  {
    path: '/settlements',
    title: 'Mes réglements',
    icon: '',
    clazz: 'nav-item',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    isNavHeader: false,
    submenu: []
  },
  {
    path: '/consumptions',
    title: 'Ma consommation',
    icon: '',
    clazz: 'nav-item',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    isNavHeader: false,
    submenu: []
  },
  {
    path: '/admin',
    title: 'Administration',
    icon: '',
    clazz: 'nav-item',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    isNavHeader: false,
    submenu: []
  }
];
