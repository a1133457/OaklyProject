import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

// 簡化的 localStorage hook
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            return initialValue
        }
    })

    const setValue = (value) => {
        try {
            setStoredValue(value)
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(value))
            }
        } catch (error) {
            console.error('LocalStorage error:', error)
        }
    }

    return [storedValue, setValue]
}

// 簡化的 interval hook
function useInterval(callback, delay) {
    const savedCallback = useRef()

    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        function tick() {
            savedCallback.current()
        }
        if (delay !== null) {
            let id = setInterval(tick, delay)
            return () => clearInterval(id)
        }
    }, [delay])
}

// 彈出視窗工具
function popupCenter(url, title, w, h) {
    const screenX = window.screenX || window.screenLeft
    const screenY = window.screenY || window.screenTop
    const outerWidth = window.outerWidth || document.documentElement.clientWidth
    const outerHeight = window.outerHeight || document.documentElement.clientHeight

    const left = screenX + (outerWidth - w) / 2
    const top = screenY + (outerHeight - h) / 2.5

    const features = [
        `width=${w}`,
        `height=${h}`,
        `left=${left}`,
        `top=${top}`,
        'scrollbars=1'
    ].join(',')

    const newWindow = window.open(url, title, features)
    if (window.focus) newWindow.focus()
    return newWindow
}

// 主要的 711 store hook
export function useShip711StoreOpener(serverCallbackUrl, options = {}) {
    const {
        title = '7-11運送店家選擇視窗',
        h = 680,
        w = 950,
        autoCloseMins = 5,
        keyLocalStorage = 'store711'
    } = options

    const [storedValue, setValue] = useLocalStorage(keyLocalStorage, {
        storeid: '',
        storename: '',
        storeaddress: '',
        outside: '',
        ship: '',
        TempVar: ''
    })

    const newWindow = useRef(null)
    const [store711, setStore711] = useState({
        storeid: '',
        storename: '',
        storeaddress: '',
        outside: '',
        ship: '',
        TempVar: ''
    })

    const [startCountDown, setStartCountDown] = useState(false)
    const [countDown, setContDown] = useState(60 * autoCloseMins)

    // 從 localStorage 載入資料
    useEffect(() => {
        if (storedValue && storedValue.storeid) {
            setStore711(storedValue)
        }
    }, [storedValue])

    // 監聽自訂事件
    useEffect(() => {
        const handleStopCountdown = () => setStartCountDown(false)
        const handleSetStore = (e) => {
            setStore711(e.detail)
            setValue(e.detail)
        }
        const handleCancel = () => {
            setStartCountDown(false)
            setContDown(60 * autoCloseMins)
        }

        document.addEventListener('stop-countdown', handleStopCountdown)
        document.addEventListener('set-store', handleSetStore)
        document.addEventListener('cancel', handleCancel)

        return () => {
            document.removeEventListener('stop-countdown', handleStopCountdown)
            document.removeEventListener('set-store', handleSetStore)
            document.removeEventListener('cancel', handleCancel)
        }
    }, [autoCloseMins, setValue])

    // 倒數計時
    useInterval(() => {
        if (newWindow.current?.closed) {
            setStartCountDown(false)
            setContDown(60 * autoCloseMins)
            return
        }

        if (countDown === 0) {
            setStartCountDown(false)
            setContDown(60 * autoCloseMins)
            newWindow.current?.close()
            return
        }

        setContDown(countDown - 1)
    }, startCountDown ? 1000 : null)

    const openWindow = () => {
        if (!serverCallbackUrl) {
            console.error('缺少 serverCallbackUrl')
            return
        }

        const url = `https://emap.presco.com.tw/c2cemap.ashx?eshopid=870&&servicetype=1&url=${serverCallbackUrl}`
        newWindow.current = popupCenter(url, title, w, h)
        setStartCountDown(true)
    }

    const closeWindow = () => {
        newWindow.current?.close()
        setStartCountDown(false)
    }

    return { store711, openWindow, closeWindow }
}

// 回調處理 hook
export function useShip711StoreCallback(keyLocalStorage = 'store711') {
    const [, setValue] = useLocalStorage(keyLocalStorage, {})
    const searchParams = useSearchParams()
    const params = Object.fromEntries(searchParams)

    useEffect(() => {
        if (Object.keys(params).length > 0) {
            window.opener?.focus()
            window.opener?.document.dispatchEvent(new CustomEvent('stop-countdown'))
            window.opener?.document.dispatchEvent(new CustomEvent('set-store', { detail: params }))
            setValue(params)
            window.close()
        }
    }, [params, setValue])
}