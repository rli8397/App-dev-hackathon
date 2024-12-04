import '../App.css'
import Logo from '../app-dev-logo.png'
export default function Dashboard({ token }: { token: any }){
    return (
        <div className="dashboard-wrapper">
            <div className='dashboard'>
                <img className="app-dev-logo" src={Logo} alt="" />
                <h1>Welcome to App Dev Bootcamp</h1>
                <h1>{token.name}</h1>
            </div>
        </div>
    )
}