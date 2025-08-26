"use client"

export default function ContactPerson({ name, phone, email, address }) {
    return (
        <div className="contact-person">
            <h4>聯絡人資訊</h4>
            <div className="contact">
                <div className="contact-detail1">
                    <div className="details">
                        <div className="detail-one">
                            <p>訂購人</p>
                            <h6>{name}</h6>
                        </div>
                        <div className="detail-one">
                            <p>手機號碼</p>
                            <h6>{phone}</h6>
                        </div>
                        <div className="detail-one">
                            <p>Email (訂單通知、電子發票寄送)</p>
                            <h6>{email}</h6>
                        </div>
                        <div className="detail-one">
                            <p>地址</p>
                            <h6>{address}</h6>
                        </div>
                    </div>
                    <button className="detail-button">
                        <p>編輯</p>
                    </button>
                </div>
                <div className="contact-line"></div>
                <div className="contact-detail2">
                    <div className="details">
                        <div className="same-person">
                            <input type="checkbox" />
                            <p>同訂購人</p>
                        </div>
                        <div className="detail-one">
                            <p>訂購人</p>
                            <h6>{name}</h6>
                        </div>
                        <div className="detail-one">
                            <p>手機號碼</p>
                            <h6>{phone}</h6>
                        </div>
                        <div className="detail-one">
                            <p>地址</p>
                            <h6>{address}</h6>
                        </div>
                    </div>
                    <button className="detail-button">
                        <p>編輯</p>
                    </button>
                </div>
            </div>
        </div>
    )
}