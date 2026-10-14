// 商店：用金幣換連勝保護、雙倍 XP、頭像
import { useBoostLeft } from '../components/Layout';
import { Coin } from '../components/ui';
import { sfx } from '../core/sfx';
import { buyAvatar, buyBoost, buyFreeze, setProfile, SHOP, SHOP_AVATARS, useSave } from '../core/store';
import { cx, fmtTime } from '../core/util';

export function ShopPage() {
  const s = useSave();
  const boost = useBoostLeft();
  const buy = (fn: () => boolean) => {
    if (fn()) sfx.coin();
    else sfx.wrong();
  };
  const freezeFull = s.streak.freezes >= SHOP.freeze.max;

  return (
    <div className="page narrow">
      <section className="card shop-head">
        <div className="grow">
          <h1>商店</h1>
          <p className="muted">金幣來自每日任務、寶箱、升段、成就和連勝里程碑。</p>
        </div>
        <Coin n={s.coins} className="big" />
      </section>

      <section className="card shop-item">
        <div className="shop-icon">❄️</div>
        <div className="grow">
          <h3>
            連勝保護 <span className="chip">持有 {s.streak.freezes} / {SHOP.freeze.max}</span>
          </h3>
          <p className="muted">哪天真的沒空學習，會自動消耗一個來保住連勝紀錄。</p>
        </div>
        <button type="button" className="btn gold" disabled={freezeFull || s.coins < SHOP.freeze.cost} onClick={() => buy(buyFreeze)}>
          {freezeFull ? '已達上限' : <Coin n={SHOP.freeze.cost} />}
        </button>
      </section>

      <section className="card shop-item">
        <div className="shop-icon">⚡</div>
        <div className="grow">
          <h3>
            雙倍 XP 藥水 {boost > 0 && <span className="chip boost">生效中 {fmtTime(boost)}</span>}
          </h3>
          <p className="muted">
            接下來 {SHOP.boost.minutes} 分鐘，所有語言獲得的 XP 加倍。適合準備一口氣衝段位的時候用；重複購買會延長時間。
          </p>
        </div>
        <button type="button" className="btn gold" disabled={s.coins < SHOP.boost.cost} onClick={() => buy(buyBoost)}>
          <Coin n={SHOP.boost.cost} />
        </button>
      </section>

      <section className="card panel">
        <header className="panel-head">
          <h2>頭像</h2>
          <small className="muted">每個 {SHOP.avatar.cost} 金幣，買了就能在個人頁切換</small>
        </header>
        <div className="shop-avatars">
          {SHOP_AVATARS.map((a) => {
            const owned = s.avatars.includes(a);
            return (
              <button
                key={a}
                type="button"
                className={cx('shop-avatar', owned && 'owned', s.avatar === a && 'on')}
                disabled={!owned && s.coins < SHOP.avatar.cost}
                onClick={() => (owned ? setProfile({ avatar: a }) : buy(() => buyAvatar(a)))}
              >
                <span>{a}</span>
                {owned ? <small>{s.avatar === a ? '使用中' : '已擁有'}</small> : <Coin n={SHOP.avatar.cost} />}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
