/*basic modules************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
import React from 'react'

/*styled components************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
import { StyledContainerDefaultCheckbox } from './styles.js'

/*main function************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
function DefaultCheckbox({value, checked, onClick}) {
    return (
        <StyledContainerDefaultCheckbox>
            <input type='checkbox' onClick={() => onClick(value)} checked={checked} />
        </StyledContainerDefaultCheckbox>
    )
}
export default DefaultCheckbox