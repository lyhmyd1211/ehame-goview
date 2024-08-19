import { Router } from 'vue-router';
import { PageEnum, PreviewEnum } from '@/enums/pageEnum'
import { loginCheck, setCookie } from '@/utils'

// 路由白名单
const routerAllowList = [
  // 登录
  PageEnum.BASE_LOGIN_NAME,
  // 预览
  PreviewEnum.CHART_PREVIEW_NAME
]
function getQueryParam(param:string) {
  let searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(param);
}
export function createRouterGuards(router: Router) {
  // 前置
  router.beforeEach(async (to, from, next) => {
    // http://localhost:3000/#/chart/preview/792622755697790976?t=123
    // 把外部动态参数放入window.route.params，后续API动态接口可以用window.route?.params?.t来拼接参数
    // @ts-ignore
    if (!window.route) window.route = {params: {}}
    // @ts-ignore
    Object.assign(window.route.params, to.query)
    let token = getQueryParam('token')
    let tenantId = getQueryParam('TENANT-ID')
    if (token) {
      sessionStorage.setItem('token',token as string)
      setCookie('token',token as string,1)
    }
    if (tenantId) {
      sessionStorage.setItem('tenant_id',tenantId as string)
      setCookie('tenant_id',tenantId as string,1)
    }
    const Loading = window['$loading'];
    Loading && Loading.start();
    const isErrorPage = router.getRoutes().findIndex((item) => item.name === to.name);
    if (isErrorPage === -1) {
      next({ name: PageEnum.ERROR_PAGE_NAME_404 })
    }

    // @ts-ignore
    // if (!routerAllowList.includes(to.name) && !loginCheck()) {
    //   next({ name: PageEnum.BASE_LOGIN_NAME })
    // }
    next()
  })

  router.afterEach((to, _, failure) => {
    const Loading = window['$loading'];
    document.title = (to?.meta?.title as string) || document.title;
    Loading && Loading.finish();
  })

  // 错误
  router.onError((error) => {
    console.log(error, '路由错误');
  });
}