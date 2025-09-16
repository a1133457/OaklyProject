'use client'

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import styles from '../user.module.css'

// const datas = [
//     { id: 1, name: 'LISABO 桌子', price: 4999, img: '/img/ting/桌子.webp' },
//     { id: 2, name: 'LISABO 桌子', price: 4999, img: '/img/ting/桌子.webp' },
// ]

export default function FavoritesPage() {
    // 管理清單
    const { getFavorites, removeFavorite } = useAuth();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const result = await getFavorites();
            if (result.success) setList(result.data || []);
            setLoading(false);
        })();
    }, [getFavorites]);

    const onRemove = async (productId, colorId, sizeId) => {
        const result = await removeFavorite(productId, colorId, sizeId);
        if (result.status === 'success') {
            setList(prev =>
                prev.filter(item => 
                    !(item.product_id === productId 
                    && item.color_id === colorId 
                    && item.size_id === sizeId)
                )
            );
        }
    };

    // if (loading) return <div>載入中…</div>;
    if (loading) return <>載入中…</>;

    if (!list.length) return (
        <>
            目前沒有收藏。去逛逛商品，點愛心加入吧！
        </>
    );

    return (
        <div>
            {list.map(item => (
                <div key={`${item.product_id}-${item.color_id}-${item.size_id}`} className={styles.favoritesRow}>
                    <img
                        src={item.product_img}
                        alt={item.name}
                        width={140}
                        height={120}
                        style={{ objectFit: 'cover' }}
                    />
                    <div className={styles.productName}>{item.name}</div>
                    <div className={styles.productPrice}>${Number(item.price).toLocaleString()}</div>
                    <div className={styles.iconActions}>
                        <i
                            className={`bi bi-heart-fill ${styles.heart}`}
                            onClick={() => onRemove(item.product_id, item.color_id, item.size_id)}
                            role="button"
                            title="取消收藏"
                        />
                        <i
                            className={`bi bi-cart ${styles.cart}`}
                            onClick={() => console.log("加入購物車")}
                            role="button"
                            title="加入購物車"
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}
