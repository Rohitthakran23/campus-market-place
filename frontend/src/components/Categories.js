import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import categories from "./CategoriesList";


function Categories(props) {

    return (
        <div className='cat-container'>
            <div>
                <span className='p-3' style={{Cursor:'pointer'}} ></span>
                {categories && categories.length > 0 &&
                    categories.map((item, index) => {
                        return (
                            <span onClick={() => props.handleCategory && props.handleCategory(item)} key={index} className='category'> {item} </span>
                            // <span  className='category'> {item} </span>
                        )
                    })}
            </div>
        </div>
    )
}


export default Categories;