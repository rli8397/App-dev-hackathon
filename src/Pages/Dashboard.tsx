import '../App.css'
export default function Dashboard({ token }: { token: any }){
    return (
        <div className='dashboard'>
            <h1>Welcome to App Dev Bootcamp</h1>
            <h1>{token.name}</h1>
        </div>
    )
}