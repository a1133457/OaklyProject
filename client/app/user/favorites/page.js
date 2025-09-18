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
    // const { getFavorites, removeFavorite } = useAuth();
    const { user, removeFavorite } = useAuth()
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    const getFavorites = async () => {
        try {
            if (!user?.id) return { success: false, message: '請先登入' };

            const response = await fetch(`http://localhost:3005/api/favorites`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('reactLoginToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('獲取收藏失敗:', error);
            return { success: false, message: error.message };
        }
    };
    useEffect(() => {
        (async () => {
            const result = await getFavorites();
            if (result.success) setList(result.data || []);
            setLoading(false);
        })();
    }, [user?.id]);

    const onRemove = async (productId) => {
        const result = await removeFavorite(productId);
        if (result.status === 'success') {
            setList(prev => prev.filter(item => item.product_id !== productId));
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
                <div key={item.product_id} className={styles.favoritesRow}>
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
                            onClick={() => onRemove(item.product_id)}
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
