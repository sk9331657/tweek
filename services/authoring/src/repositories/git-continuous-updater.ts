import { Observable } from 'rxjs';
const { CONTINUOUS_UPDATER_INTERVAL } = require('../constants');
import { logger } from '../utils/jsonLogger';

export default {
  onUpdate(gitTransactionManager) {
    const updateRepo$ = Observable.defer(async () => {
      await gitTransactionManager.read(async gitRepo => await gitRepo.fetch());
      return await gitTransactionManager.write(async gitRepo => await gitRepo.mergeMaster());
    });

    return updateRepo$
      .do(null, err => logger.error('Error pulling changes in git repo', err))
      .catch(_ => Observable.empty())
      .concat(Observable.empty().delay(CONTINUOUS_UPDATER_INTERVAL))
      .repeat()
      .distinctUntilChanged()
      .do(sha => logger.log('Updated git repo', sha));
  },
};
