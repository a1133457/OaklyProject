'use client'

import Sidebar from '../_components/sidebar'
import HeaderImg from '../_components/HeaderImg'
import styles from '../user.module.css'

const items = [
    {
        id: 1,
        title: '不用大改裝！從家具搭配開始：配色、材質、家具怎麼選？',
        date: '2025-07-01',
        img: '/img/header.jpg',
        summary: '想要改變居家空間，但又不想大興土木？從家具的色調與材質下手，自然打造舒服又有風格的居家空間...'
    }
]

export default function BookmarksPage() {
    return (
        <div>
            <HeaderImg title="FAVORITES" />
            <div className={`container ${styles.container}`}>
                <div className="row">
                    <div className="col-md-3"><Sidebar /></div>
                    <div className="col-md-9">
                        {items.map(a => (
                            <div key={a.id} className={styles.bookmarkRow}>
                                <i className={`bi bi-bookmark-fill ${styles.bookmarkIcon}`} />
                                <img src={a.img} alt="" width={140} height={120} style={{ objectFit: 'cover' }} />
                                <div style={{ flex: 1 }}>
                                    <div className={styles.bookmarkTitle}>{a.title}</div>
                                    <div className={styles.bookmarkText}>{a.summary}</div>
                                    <div className={styles.bookmarkFooter}>
                                        <span>{a.date}</span>
                                        <a className={styles.bookmarkLink} href="#">閱讀更多 <i className="bi bi-chevron-double-right" /></a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
