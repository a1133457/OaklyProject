'use client'
import Sidebar from '../_components/sidebar'
import HeaderImg from '../_components/HeaderImg'
import styles from '../user.module.css'

const data = [
    { id: 1, name: 'LISABO 桌子', price: 4999, img: '/img/ting/桌子.webp' },
    { id: 2, name: 'LISABO 桌子', price: 4999, img: '/img/ting/桌子.webp' },
]

export default function FavoritesPage() {
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
                        {data.map(p => (
                            <div key={p.id} className={styles.itemRow}>
                                <img src={p.img} alt="" width={100} height={100} />
                                <div className={styles.productName}>{p.name}</div>
                                <div className={styles.productPrice}>${p.price.toLocaleString()}</div>
                                <div className={styles.iconActions}>
                                    <i className={`bi bi-heart-fill ${styles.heart}`} />
                                    <i className="bi bi-cart" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
