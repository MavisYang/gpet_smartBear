import React,{Component} from 'react'
import Input from 'antd/lib/input'
import 'antd/lib/input/style/css'
import './searchInput.css'

export default class SearchInput extends Component {
    render(){
        const {inputStyle,placeholder,handle} = this.props
        return (
            <Input.Search
                className={inputStyle}
                placeholder={placeholder}
                onSearch={value => handle(value)}
            />
        )
    }
}