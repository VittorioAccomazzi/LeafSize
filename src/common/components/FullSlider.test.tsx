import { fireEvent, render } from '@testing-library/react';
import FullSlider from './FullSlider'


test('Full Slider Render', ()=>{
    const array = ["one", "two", "three"];
    const wrapper = render( 
        <FullSlider
            label='FullSlider Test Label'
            values={array}
            disabled={false}
            onChange={(i,v)=>{}}
        />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.getByText(/one/i)).toBeInTheDocument();
})

test('Full Slider dynamic behaviour', async ()=>{
    const array = ["one", "two", "three"];
    let index =0;
    let value ="";

    const wrapper = render( 
        <FullSlider
            label='FullSlider Test Label'
            values={array}
            disabled={false}
            onChange={(i,v)=>{index=i; value=v;}}
        />
    );

    const leftButton = (await wrapper.findAllByTestId('left-click'))[0]  as HTMLButtonElement;
    const rightButton= (await wrapper.findAllByTestId('right-click'))[0] as HTMLButtonElement;
    const resultLabel= (await wrapper.findAllByTestId('result-label'))[0] as HTMLLabelElement;

    // left button shall be disabled
    expect(rightButton.disabled).toBeFalsy();
    expect(leftButton.disabled).toBeTruthy();

    // right button shall change the label
    fireEvent.click(rightButton)
    expect(wrapper.getByText(/two/i)).toBeInTheDocument();
    expect(index).toBe(1);
    expect(value).toBe(array[index]);
    expect(resultLabel.innerHTML).toBe('two');

    // right button shall change the label again
    fireEvent.click(rightButton)
    expect(wrapper.getByText(/three/i)).toBeInTheDocument();
    expect(index).toBe(2);
    expect(value).toBe(array[index]);

    // right button shall be disabled
    expect(rightButton.disabled).toBeTruthy();
    expect(leftButton.disabled).toBeFalsy();
})

test ('Full Slider shall reset index when values propery chages',async ()=>{
    const arrayOld = ["old one", "old two", "old three", "old four"];
    const arrayNew = ["new one", "new two" ];

    const wrapper = render( 
        <FullSlider
            label='FullSlider Test Label'
            values={arrayOld}
            disabled={false}
            onChange={(i,v)=>{}}
        />
    );

    const leftButton = (await wrapper.findAllByTestId('left-click'))[0]  as HTMLButtonElement;
    const rightButton= (await wrapper.findAllByTestId('right-click'))[0] as HTMLButtonElement;
    const resultLabel= (await wrapper.findAllByTestId('result-label'))[0] as HTMLLabelElement;

    expect(leftButton.disabled).toBeTruthy();

    fireEvent.click(rightButton); // two
    fireEvent.click(rightButton); // three
    fireEvent.click(rightButton); // four

    expect(rightButton.disabled).toBeTruthy();
    expect(resultLabel.innerHTML).toBe(arrayOld[3]);

    wrapper.rerender(
        <FullSlider
            label='FullSlider Test Label'
            values={arrayNew}
            disabled={false}
            onChange={(i,v)=>{}}
        />
    );

    expect(leftButton.disabled).toBeTruthy();
    expect(rightButton.disabled).toBeFalsy();
    expect(resultLabel.innerHTML).toBe(arrayNew[0]);

})

test ('Full Slider shall set the default index',async ()=>{
    const array = ["one", "two", "three", "four"];
    let index =0;
    let value ="";

    const wrapper = render( 
        <FullSlider
            label='FullSlider Test Label'
            values={array}
            disabled={false}
            defaultIndex={2}
            onChange={(i,v)=>{index=i; value=v;}}
        />
    );

    const leftButton = (await wrapper.findAllByTestId('left-click'))[0]  as HTMLButtonElement;
    const rightButton= (await wrapper.findAllByTestId('right-click'))[0] as HTMLButtonElement;
    const resultLabel= (await wrapper.findAllByTestId('result-label'))[0] as HTMLLabelElement;

    expect(leftButton.disabled).toBeFalsy();
    expect(rightButton.disabled).toBeFalsy();
    expect(resultLabel.innerHTML).toBe(array[2]);
    expect(index).toBe(2);
    expect(value).toBe(array[2]);
})

test('inverted Slider', async ()=>{
    const array = ["one", "two", "three", "four"];
    let index =0;
    let value ="";

    const wrapper = render( 
        <FullSlider
            label='FullSlider Test Label'
            values={array}
            disabled={false}
            defaultIndex={2}
            inverted={true}
            onChange={(i,v)=>{index=i; value=v;}}
        />
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.getByText(/three/i)).toBeInTheDocument();
})