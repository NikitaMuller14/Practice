import React from "react"
import BACKEND_URL from "../config"

class Register extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            error: null,
            lastName: "",
            firstName: "",
            login: "",
            password: "",
            rep_password: ""
        }
    }

    render() {
        const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/
        const len_regex = /^.{8,}$/
        const upp_regex = /[A-Z]/
        const low_regex = /[a-z]/
        const num_regex = /[0-9]/
        let registerData = {}
        return (
            <form ref={(el) => this.myForm = el}>
                <input
                    className="top"
                    placeholder="Фамилия"
                    onChange={(ans) => { this.setState({ lastName: ans.target.value }) }}
                />
                <input
                    placeholder="Имя"
                    onChange={(ans) => { this.setState({ firstName: ans.target.value }) }}
                />
                <input
                    placeholder="Логин"
                    onChange={(ans) => { this.setState({ login: ans.target.value }) }}
                />
                <div className="info">
                    <p>{!regex.test(this.state.password)
                        && "Пароль должен содержать:\n"}
                    </p>
                    <p>{!len_regex.test(this.state.password)
                        && "     * Не менее 8 символов;\n"}
                    </p>
                    <p>{!num_regex.test(this.state.password)
                        && "     * Не менее 1 цифры;\n"}
                    </p>
                    <p>{!upp_regex.test(this.state.password)
                        && "     * Не менее 1 заглавной латинской буквы;\n"}
                    </p>
                    <p>{!low_regex.test(this.state.password)
                        && "     * Не менее 1 прописной латинской буквы;\n"}
                    </p>
                </div>
                <input
                    type="password"
                    placeholder="Пароль"
                    onChange={(ans) => {
                        this.setState({ password: ans.target.value })
                    }}
                />
                <input
                    type="password"
                    placeholder="Подтвердите пароль"
                    onChange={(ans) => {
                        this.setState({ rep_password: ans.target.value })
                    }}
                />
                <div className="info">
                    <p> {
                        this.state.password
                        && !regex.test(this.state.password)
                        && "Пароль не удовлетворяет требованиям"}
                    </p>
                    <p>{
                        this.state.password
                        && regex.test(this.state.password)
                        && (this.state.password !== this.state.rep_password)
                        && "Введёные пароли не совпадают"}
                    </p>
                </div>
                <br />
                <button
                    type="button"
                    disabled={
                        (regex.test(this.state.password)
                            && (this.state.password === this.state.rep_password)
                            && this.state.lastName
                            && this.state.firstName
                            && this.state.login)
                            ? false
                            : true
                    }
                    onClick={() => {
                        this.myForm.reset()
                        registerData = {
                            lastName: this.state.lastName,
                            firstName: this.state.firstName,
                            login: this.state.login,
                            password: this.state.password,
                            rep_passwrod: this.state.rep_password
                        }
                        this.setState({
                            error: null,
                            lastName: "",
                            firstName: "",
                            login: "",
                            password: "",
                            rep_password: "",
                        })
                        this.onRegister(registerData)
                        registerData = {}
                    }
                    }>
                    Регистрация
                </button>
                <p>{this.state.error && `Ошибка: ${this.state.error}`}</p>
                <br /><br />
                <p>
                    Уже зарегестрированы?&nbsp;
                </p>
                <button
                    className="link"
                    type="link"
                    onClick={() => {
                        this.myForm.reset()
                        this.setState({ login: "", password: "" })
                        this.props.onChange("login")
                    }
                    }>
                    Войти
                </button>
            </form>
        )
    }

    async onRegister(registerData) {

        let response = await fetch(`${BACKEND_URL}/register`, {
            method: "POST",
            headers: {
                "Content-type": "application/json;charset=utf-8",
                "accept": "application/json;charset=utf-8"
            },
            body: JSON.stringify(registerData)
        })

        if (!response.ok) {
            this.setState({ error: response.status })
            return
        }

        var responseJSON = await response.json()
        if (!responseJSON.isValid) {
            this.setState({ error: "Логин уже используется" })
            return
        }
        this.setState({ error: null })
        this.userData = {
            name: registerData.firstName,
            surname: registerData.lastName
        }
        this.props.onChange("profile", this.userData)
    }


}


export default Register