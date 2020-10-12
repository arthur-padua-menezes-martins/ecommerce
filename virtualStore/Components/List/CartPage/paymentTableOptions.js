/*basic modules************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
import React from 'react'

/*redux************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
import { connect } from 'react-redux'
import actions from '../../../redux/actions/index.js'

/*components************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
import AccountDefaultTable from '../../Account/Table/Default/index.js'

/*styled components************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
import {
    StyledContainerPaymentTableOptions
} from './styles.js'

/*main function************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
function DeliveryOptions(props) {

    /*props************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
    const
        { cart, selectedFrete, children } = props,
        cartTotal = (cart || []).reduce((acumulator, item) => acumulator + Number(item.unitaryValue) * Number(item.quantity), 0)

    /*const's************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
    const
        heads = props.whatsapp.whatsappVersion ? ['total'] : ['subtotal', 'frete', 'total'],
        informations = props.whatsapp.whatsappVersion ? ([
            { total: `R$ ${cartTotal}` }
        ]) : ([
            { subtotal: `R$ ${cartTotal}` },
            { frete: (selectedFrete || '...') },
            { total: (cartTotal + selectedFrete || '...') }
        ])



    /*render function************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
    function renderDefault() {
        return (

            <StyledContainerPaymentTableOptions>

                <AccountDefaultTable
                    containerHeight={'60%'}
                    height={'100%'}
                    type={'cartPage'}
                    heads={heads}
                    informations={informations} />

            </StyledContainerPaymentTableOptions>

        )
    }
    function renderChildren() {
        return (
            <header>
                {children}
            </header>
        )
    }




    /*return************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
    return (
        <>
            { !children ? renderDefault() : renderChildren()}
        </>
    )

}

const mapStateToProps = (state, ownProps) => ({
    whatsapp: state.whatsapp,
    cart: state.cart.cart, 
    selectedFrete: state.cart.selectedFrete, 
    ownProps,
})
export default connect(mapStateToProps, actions)(DeliveryOptions)