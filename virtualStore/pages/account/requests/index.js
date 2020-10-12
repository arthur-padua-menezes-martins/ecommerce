/*basic modules************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
import React, { useState, useEffect } from 'react'

/*redux************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
import { connect } from 'react-redux'
import actions from '../../../redux/actions/index.js'
import getBaseInfo from '../../../helpers/getBaseInfo.js'

/*containers************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
import Header from '../../../Containers/Header/index.js'
import SubHeader from '../../../Containers/SubHeader/index.js'

/*components************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
import Layout from '../../../Components/Layout/index.js'
import LayoutAccount from '../../../Components/Layout/account.js'
import LayoutMenuAccount from '../../../Components/Layout/menuAccount.js'
import LayoutBodyAccount from '../../../Components/Layout/bodyAccount.js'
import AccountMenu from '../../../Components/Account/Menu/index.js'
import AccountRequests from '../../../Components/Account/Requests/index.js'

/*main function************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
function Requests(props) {


    if (typeof window !== 'undefined') {

        /*state************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
        var [InitialInnerWidth, setInitialInnerWidth] = useState(window.innerWidth)

        /*hooks************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
        useEffect(() => { props.verifyAuthentication() }, [])




        if (props.login.authentication.authenticated !== null) {
            if (props.login.authentication.authenticated === true) {


                if (window.innerWidth > 720) {
                    return (
                        <Layout backgroundColor={'#f5f5f5'}>
                            <Header
                                InitialInnerWidth={InitialInnerWidth}
                                setInitialInnerWidth={setInitialInnerWidth}
                                Desktop={true}
                                Mobile={false}
                                Default={true} />
                            <SubHeader
                                informations={props[0].payload}
                                Desktop={true}
                                Mobile={false} />
                            <LayoutAccount>

                                <LayoutMenuAccount>
                                    <AccountMenu informations={''} selected={'request'} />
                                </LayoutMenuAccount>

                                <LayoutBodyAccount>

                                    <AccountRequests
                                        type={'requests'}
                                        heads={''}
                                        informations={''} />

                                </LayoutBodyAccount>

                            </LayoutAccount>
                        </Layout>
                    )
                }

                if (window.innerWidth <= 720) {
                    return (
                        <Layout backgroundColor={'#f5f5f5'}>
                            <Header
                                InitialInnerWidth={InitialInnerWidth}
                                setInitialInnerWidth={setInitialInnerWidth}
                                Desktop={false}
                                Mobile={true}
                                Account={true} />
                            <LayoutAccount>

                                <LayoutMenuAccount>
                                    <AccountMenu informations={''} selected={'request'} />
                                </LayoutMenuAccount>

                                <LayoutBodyAccount>

                                    <AccountRequests
                                        type={'requests'}
                                        heads={''}
                                        informations={''} />

                                </LayoutBodyAccount>

                            </LayoutAccount>
                        </Layout>
                    )
                }


            } else { window.location.href = '/login?authenticated=false' }
        } else { return (<></>) }
    } else { return (<></>) }

}

Requests.getInitialProps = async (ctx) => {

    return getBaseInfo([
        actions.getSubHeaders
    ], ctx)

}

const mapStateToProps = (state, ownProps) => ({
    ...state, ownProps
})
export default connect(mapStateToProps, actions)(Requests)