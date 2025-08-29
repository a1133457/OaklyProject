'use client'

import { useState } from 'react'
import Sidebar from '../_components/sidebar'
import HeaderImg from '../_components/HeaderImg'
import styles from '../user.module.css'

const datas = [
    { id: 1, name: 'LISABO 桌子', price: 4999, img: '/img/ting/桌子.webp' },
    { id: 2, name: 'LISABO 桌子', price: 4999, img: '/img/ting/桌子.webp' },
]

export default function FavoritesPage() {
    // 管理清單
        const [list, setList] = useState(datas)
    
        // 點擊時「真的移除」：把 id 不等於的留下
        const removeFavorites = (id) => {
            setList(prev => prev.filter(a => a.id !== id))
        }

    return (
        <div>
            <HeaderImg title="FAVORITES" />
            <div className={`container-fluid ${styles.userContainer}`}>
                <div className={styles.layout}>
                    <div className={styles.sidebarWrapper}>
                    <Sidebar />
                    </div>
                    {/* 右右右 */}
                    <div className={styles.content}>
                        {datas.map(p => (
                            <div key={p.id} className={styles.favoritesRow}>
                                <img src={p.img} alt="" width={140} height={120} style={{ objectFit: 'cover' }} />
                                {/* <img src={p.img} alt="" width={100} height={100} /> */}
                                <div className={styles.productName}>{p.name}</div>
                                <div className={styles.productPrice}>${p.price.toLocaleString()}</div>
                                <div className={styles.iconActions}>
                                    <i className={`bi bi-heart-fill ${styles.heart}`} />
                                    <i className="bi bi-cart" />
                                    <img
                                    src="/img/ting/icon-heart-fill.svg"
                                    alt="favoritesicon"
                                    className={styles.bookmarkIcon}
                                    onClick={() => removeFavorites(p.id)}
                                    role="button"
                                    title="取消收藏"
                                    />
                                    <img
                                    src="/img/ting/icon-cart.svg"
                                    alt="favoritesicon"
                                    className={styles.bookmarkIcon}
                                    onClick={() => removeFavorites(p.id)}
                                    role="button"
                                    title="加入購物車"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
