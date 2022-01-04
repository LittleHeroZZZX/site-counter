const {
  router,
  productPostRouter,
  verifySign,
  getAllReqParams,
  API_SIGN_SECRET_KEY
} = require('./router-base');
const siteCounterHandler = require('./handlers/site-counter');
const {getLogger} = require('../log');
const log = getLogger('API');

const {
  FailResStateCode
} = require('../enum/api-fail-code');

productPostRouter(router, '/site_counter', (apiId, req, res) => {
  const clientIp = req.ip;
  const allParams = getAllReqParams(req);

  log.debug('call /site_counter, allParams:', allParams,
    ' ,clientIp:', clientIp,
    ' ,apiId:', apiId
  );

  const {
    site_md5: siteMd5,
    site_page_md5: sitePageMd5,
    is_incr_site: isIncrSite,
    is_histroy_session: isHistroySession
  } = allParams;

  if (!siteMd5) {
    log.error('invalid params, apiId:', apiId);

    res.status(401).send({
      code: FailResStateCode.INVALID_PARAMS,
      message: 'invalid params'
    });

    return;
  }

  // if (!verifySign(req, siteMd5+API_SIGN_SECRET_KEY)) {
  //   log.error('Unauthorized, invalid sign, apiId:', apiId);

  //   res.status(401).send({
  //     code: FailResStateCode.UNAUTHORIZED,
  //     message: 'invalid sign'
  //   });

  //   return;
  // }

  siteCounterHandler.incrSiteCount(
    siteMd5,
    sitePageMd5,
    isIncrSite,
    isHistroySession,
    (err, result) => {
      if (err) {
        log.error('incrSiteCount err:', err, ' ,apiId:', apiId);

        res.status(401).send({
          code: FailResStateCode.FAILURE,
          message: typeof err === 'object' ? err.message : 'incrSiteCount err'
        });
        return;
      }

      res.json(result);
    }
  );
});

module.exports = router;