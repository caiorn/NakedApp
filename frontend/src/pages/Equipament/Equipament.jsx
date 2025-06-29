import { useLoaderData } from "react-router-dom"

export default function Equipament(){
    const equipament = useLoaderData();

    return (
        <section>
            <p>{JSON.stringify(equipament)}</p>
        </section>
    )
}