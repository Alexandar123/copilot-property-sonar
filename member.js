function skillMember() {
  return {
    name: 'skillMember',
    path: '/skill/member',
    component: () => import('@/views/skill/member'),
    meta: {
      title: '技能成员',
      icon: 'skill',
      noCache: true
    }
  }
}