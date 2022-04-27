import { render } from '@testing-library/react';
import OptionsList from './OptionList';
import dish1Leaf1 from '../../assets/dish-1-leaf-1.svg'
import dish4Leaf1 from '../../assets/dish-1-leaf-1.svg'

test('Basic Rendering', ()=>{
    const wrapper = render( 
        <OptionsList
            imgSrc1={dish1Leaf1}
            imgSrc2={dish4Leaf1}
            label1="One Dish"
            label2="Four Dishes"
            selected1 = {true}
            selected2 = {false}
            click1={()=>null}
            click2={()=>null}
            title="Select Image Layout"
        />
    );
    expect(wrapper).toMatchSnapshot();
})