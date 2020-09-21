# KISS-ROUTER

```javascript
import router from '../kiss/kiss-router'
import authorize from '../app/app-authorize'
import getVerify from './get-verify'
import getDesign from './get-design'
import getOrder from './get-order'
import putUpload from './put-upload'
import postDesign from './post-design'

console.log('APP_INDEX_STARTUP')

export default router({
  get: {
    verify: getVerify,
    design: getDesign,
    order: getOrder
  },
  put: {
    upload: authorize(putUpload)
  },
  post: {
    design: authorize(postDesign)
  }
})

```
