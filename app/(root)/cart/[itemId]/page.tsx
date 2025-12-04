import CardAddItem from "./card-add-item";

export default async function CartAddItem(props:{ params: Promise<{itemId: string}>}){
    const {itemId} = await props.params

    return <CardAddItem itemId={itemId}/>

}