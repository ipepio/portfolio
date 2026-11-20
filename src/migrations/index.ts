import * as migration_20261119_144525 from './20261119_144525';
import * as migration_20261119_165457 from './20261119_165457';
import * as migration_20261120_075136 from './20261120_075136';
import * as migration_20261120_220601_portfolio_project_hero from './20261120_220601_portfolio_project_hero';

export const migrations = [
  {
    up: migration_20261119_144525.up,
    down: migration_20261119_144525.down,
    name: '20261119_144525',
  },
  {
    up: migration_20261119_165457.up,
    down: migration_20261119_165457.down,
    name: '20261119_165457',
  },
  {
    up: migration_20261120_075136.up,
    down: migration_20261120_075136.down,
    name: '20261120_075136',
  },
  {
    up: migration_20261120_220601_portfolio_project_hero.up,
    down: migration_20261120_220601_portfolio_project_hero.down,
    name: '20261120_220601_portfolio_project_hero'
  },
];
