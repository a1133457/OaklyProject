"use client"

export default function Payment() {
    return (
        <>
            <div className="payment">
                <div className="pay">
                    <h4>付款方式</h4>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="radioDefault" id="radioDefault1" />
                        <label className="form-check-label" htmlFor="radioDefault1">
                            <h6>信用卡</h6>
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="radioDefault" id="radioDefault2" />
                        <label className="form-check-label" htmlFor="radioDefault2">
                            <h6>信用卡</h6>
                        </label>
                    </div>
                </div>



                <div className="p-line"></div>
                <div className="invoice">
                    <h4>發票類型</h4>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="radioDefault" id="radioDefault1" />
                        <label className="form-check-label" htmlFor="radioDefault1">
                            <h6>電子發票</h6>
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="radioDefault" id="radioDefault2" />
                        <label className="form-check-label" htmlFor="radioDefault2">
                            <h6>紙本發票</h6>
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}