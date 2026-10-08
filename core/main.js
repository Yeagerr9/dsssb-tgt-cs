import {observeAuth,signInOrCreate,resetPassword,verifyEmail,logout} from './auth.js';
import {setUser,load,loadLocal,getState,legacyMigrate} from './store.js';
import {registry,byId,loadModule} from './registry.js';
import '../data/catalog.js';
import {topicRows} from '../modules/utils.js';
import {queueSave} from './store.js';
import '../engine/tests.js';
import {startRouter,navigate} from './router.js';
// startup import fix: CSS is loaded by portal.html
