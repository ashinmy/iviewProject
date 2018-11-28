import Main from '@/view/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/system',
    name: 'component',
    meta: {
      icon: 'ios-apps',
      title: '资料管理'
    },
    component: Main,
    /*children: [
      {
        path: 'user',
        name: 'user',
        meta:{
          icon: 'compose',
          title: '用户管理'
        },
        component: () => import('@/view/system/user/user.vue')
      },
      {
        path: 'auth',
        name: 'auth',
        meta:{
          icon: 'pound',
          title: '权限管理'
        },
        component: () => import('@/view/system/auth/auth.vue')
      }
    ]*/
  },
  {
    path: '/credit-management',
    name: 'credit-management',
    meta: {
      icon: 'ios-stats',
      title: '授信管理'
    },
    component: Main,
    children: [
      { path: 'creditManagement',name: 'creditManagement',meta:{ title: '授信经办',  icon: 'compose'}, component: () => import('@/view/credit-management/creditManagement/creditManagement.vue') },
      { path: 'firstTrialCredit ',name: 'firstTrialCredit',meta:{ title: '授信初审',  icon: 'arrow-swap'}, component: () => import('@/view/credit-management/firstTrialCredit/firstTrialCredit.vue') },
      { path: 'finalTrialCredit',name: 'finalTrialCredit',meta:{ title: '授信终审',  icon: 'compose'}, component: () => import('@/view/credit-management/finalTrialCredit/finalTrialCredit.vue') },
      { path: 'processView',name: 'processView',meta:{ title: '流程查看',  icon: 'compose'}, component: () => import('@/view/credit-management/processView/processView.vue') }
    ]
  },
  {
    path: '/useCredit-management',
    name: 'useCredit-management',
    meta: {
      icon: 'md-menu',
      title: '用信管理'
    },
    component: Main,
    children: [
      { path: 'useCreditManagement',name: 'useCreditManagement',meta:{ title: '用信经办',  icon: 'compose'}, component: () => import('@/view/useCredit-management/useCreditManagement/useCreditManagement.vue') },
      { path: 'useFirstTrialCredit ',name: 'useFirstTrialCredit',meta:{ title: '用信初审',  icon: 'arrow-swap'}, component: () => import('@/view/useCredit-management/useFirstTrialCredit/useFirstTrialCredit.vue') },
      { path: 'useFinalTrialCredit',name: 'useFinalTrialCredit',meta:{ title: '用信终审',  icon: 'compose'}, component: () => import('@/view/useCredit-management/useFinalTrialCredit/useFinalTrialCredit.vue') },
      { path: 'useProcessView',name: 'useProcessView',meta:{ title: '流程查看',  icon: 'compose'}, component: () => import('@/view/useCredit-management/useProcessView/useProcessView.vue') }
    ]
    /*children: [
      {
        path: 'level_2_1',
        name: 'level_2_1',
        meta: {
          icon: 'md-funnel',
          title: '二级-1'
        },
        component: () => import('@/view/multilevel/level-2-1.vue')
      },
      {
        path: 'level_2_2',
        name: 'level_2_2',
        meta: {
          access: ['super_admin'],
          icon: 'md-funnel',
          showAlways: true,
          title: '二级-2'
        },
        component: parentView,
        children: [
          {
            path: 'level_2_2_1',
            name: 'level_2_2_1',
            meta: {
              icon: 'md-funnel',
              title: '三级'
            },
            component: () => import('@/view/multilevel/level-2-2/level-3-1.vue')
          }
        ]
      },
      {
        path: 'level_2_3',
        name: 'level_2_3',
        meta: {
          icon: 'md-funnel',
          title: '二级-3'
        },
        component: () => import('@/view/multilevel/level-2-3.vue')
      },
    ]*/
  },
  {
    path: '/gps',
    name: 'gps',
    meta: {
      icon: 'md-cloud-upload',
      title: '还款管理'
    },
    component: Main,
    /*children: [
      { path: 'sign-record', meta:{title: '签到管理',icon: 'arrow-move'}, name: 'sign-record', component: () => import('@/view/gps/sign-record/sign-record.vue') },
      { path: 'trajectory', meta:{title: '车辆轨迹',icon: 'edit'}, name: 'trajectory',  component: () => import('@/view/gps/trajectory/trajectory.vue') },
      { path: 'warn', meta:{title: '报警明细',icon: 'search'},  name: 'warn', component: () => import('@/view/gps/warn/warn.vue') }
    ]*/
  },
  {
    path: '/oil',
    name: 'oil',
    meta: {
      icon: 'ios-infinite',
      title: '交易统计'
    },
    component: Main,
    /*children: [
      { path: 'oil-enterprise-recharge', name: 'oil-enterprise-recharge',meta:{title: '油卡充值与分配',  icon: 'link'}, component: () => import('@/view/oil/oil-enterprise-recharge/oil-enterprise-recharge.vue') },
      { path: 'oil-recharge-record', name: 'oil-recharge-record',meta:{title: '油卡充值记录',  icon: 'link'}, component: () => import('@/view/oil/oil-recharge-record/oil-recharge-record.vue') },
      { path: 'oil-allocation-record', name: 'oil-allocation-record',meta:{title: '油卡分配记录',  icon: 'link'}, component: () => import('@/view/oil/oil-allocation-record/oil-allocation-record.vue') },

      { path: 'oil-channel', name: 'oil-channel',meta:{title: '油卡渠道',  icon: 'link'}, component: () => import('@/view/oil/oil-channel/oil-channel.vue') },
      { path: 'oil-enterprise', name: 'oil-enterprise',meta:{title: '企业油卡',  icon: 'android-send'}, component: () => import('@/view/oil/oil-enterprise/oil-enterprise.vue') },
      { path: 'enterprise-flow', name: 'enterprise-flow',meta:{title: '企业流水',  icon: 'android-send'}, component: () => import('@/view/oil/enterprise-flow/enterprise-flow.vue') },
      { path: 'person-flow', name: 'person-flow',meta:{title: '个人流水',  icon: 'android-send'}, component: () => import('@/view/oil/person-flow/person-flow.vue') }
    ]*/
  },

  {
    path: '/finance',
    name: 'finance',
    meta: {
      icon: 'ios-infinite',
      title: '报表管理'
    },
    component: Main,
    /*children: [
      { path: 'channel', meta:{title: '渠道管理', icon: 'link'}, name: 'channel', component: () => import('@/view/finance/channel/channel.vue') },
      { path: 'business-type', meta:{title: '业务类型', icon: 'android-send'}, name: 'business-type',  component: () => import('@/view/finance/business-type/business-type.vue') },
      { path: 'trans-flow', meta:{title: '交易流水',  icon: 'android-send'},name: 'trans-flow', component: () => import('@/view/finance/trans-flow/trans-flow.vue') },
      { path: 'banks-flow', meta:{title: '银行流水', icon: 'android-send'}, name: 'banks-flow',  component: () => import('@/view/finance/banks-flow/banks-flow.vue') },
      { path: 'reconciliation', meta:{title: '对账记录', icon: 'android-send'}, name: 'reconciliation',  component: () => import('@/view/finance/reconciliation/reconciliation.vue')},
      { path: 'errflow-manager', meta:{title: '差错管理', icon: 'android-send'}, name: 'errflow-manager',  component: () => import('@/view/finance/errflow-manager/errflow-manager.vue') }
    ]*/
  },
  {
    path: '/components',
    name: 'components',
    meta: {
      icon: 'logo-buffer',
      title: '系统设置'
    },
    component: Main,
    /*children: [
      {
        path: 'count_to_page',
        name: 'count_to_page',
        meta: {
          icon: 'md-trending-up',
          title: '数字渐变'
        },
        component: () => import('@/view/components/count-to/count-to.vue')
      },
      {
        path: 'drag_list_page',
        name: 'drag_list_page',
        meta: {
          icon: 'ios-infinite',
          title: '拖拽列表'
        },
        component: () => import('@/view/components/drag-list/drag-list.vue')
      },
      {
        path: 'tables_page',
        name: 'tables_page',
        meta: {
          icon: 'md-grid',
          title: '多功能表格'
        },
        component: () => import('@/view/components/tables/tables.vue')
      },
      {
        path: 'split_pane_page',
        name: 'split_pane_page',
        meta: {
          icon: 'md-pause',
          title: '分割窗口'
        },
        component: () => import('@/view/components/split-pane/split-pane.vue')
      },
      {
        path: 'markdown_page',
        name: 'markdown_page',
        meta: {
          icon: 'logo-markdown',
          title: 'Markdown编辑器'
        },
        component: () => import('@/view/components/markdown/markdown.vue')
      },
      {
        path: 'editor_page',
        name: 'editor_page',
        meta: {
          icon: 'ios-create',
          title: '富文本编辑器'
        },
        component: () => import('@/view/components/editor/editor.vue')
      },
      {
        path: 'icons_page',
        name: 'icons_page',
        meta: {
          icon: '_bear',
          title: '自定义图标'
        },
        component: () => import('@/view/components/icons/icons.vue')
      }
    ]*/
  },
  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'params/:id',
        name: 'params',
        meta: {
          icon: 'md-flower',
          title: '动态路由',
          notCache: true
        },
        component: () => import('@/view/argu-page/params.vue')
      },
      {
        path: 'query',
        name: 'query',
        meta: {
          icon: 'md-flower',
          title: '带参路由',
          notCache: true
        },
        component: () => import('@/view/argu-page/query.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
