import "../style/setting.css";

const Setting = () => {
    return (
        <div className="settingComponent">
            <div className="settAccount">
                <div className="settHead">
                    <h3>Pengaturan akun</h3>
                </div>
                <div className="option">
                    <div>
                        <label className="label">kelola kata sandi</label>
                    </div>
                    <small>
                        update atau kelola kata sandi akun anda disini
                    </small>
                </div>
            </div>
            <div className="settNotif">
                <div className="settHead">
                    <h3>Pengaturan Pemberitahuan</h3>
                </div>
                <div className="option">
                    <div>
                        <label class="switch">
                            <input type="checkbox" id="email"/>
                            <span class="slider round"></span>
                        </label>
                        <label htmlFor="email" className="label">kirim pemberitahuan ke email saya</label>
                    </div>
                    <small>
                        jika anda men ON kan fitur ini, setiap pemberitahuan yang di terima oleh akun ini 
                        akan di kirimkan ke email anda yang terkait pada akun ini secara real-time atau langsung
                    </small>
                </div>
            </div>
        </div>
    )
}

export default Setting;