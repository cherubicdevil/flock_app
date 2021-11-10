import React, {useState, useEffect} from 'react';

import StripeCheckout from 'App/code/stripe/StripeCheckout';
import {FirebaseReceiver, FirebaseUpdater} from 'App/code/firebase';

const Confirmer = ({data}) => {
        const path = {
                collection: "products",
                doc: data.productId,
        }

        const [product, setProduct] = useState();
        const [unconfirmed, setUnconfirmed] = useState(false);
        // hooks
        const [stripeHook, setStripeHook] = useState(()=>{});
        const [update, setUpdateHook] = useState(()=>{});

        // confirmed is 0,0,0,0,0 to start.
        data.confirmed

        useEffect(()=> {
                if (data.status == "unconfirmed") {
                        setUnconfirmed(true);
                }
        }, [data])


        return <>
                <ConfirmButton visible={unconfirmed} onPress={stripeHook} />
                <FirebaseReceiver path={path} setData = {setProduct} />
                <FirebaseUpdater path={updatePath} data={{numberConfirmed: "_INCREMENT_1"}} setHook={updateHook} />
                <StripeCheckout amount={(userPercent * product.price).toFixed(2)} setHook={setStripeHook} delayedCharge={true} completeFunc = {()=>{
                        // increments number confirmed by 1
                        update();
                }} />
        </>;
}

const ConfirmButton = ({visible, onPress}) => {
        return <>
                <Button title="confirm" onPress={onPress} />
        </>
}

export default Confirmer;