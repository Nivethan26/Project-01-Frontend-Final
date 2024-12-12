import "./widgetLg.css"

export default function WidgetLg() {

  const Button = ({type}) =>{
    return <button className={"widgetLgButton " + type}>{type}</button>
  }

  return (
    <div className="widgetLg">
        <h3 className="widgetLgTitle">Latect transactions</h3>
        <table className="widgetLgTable">
          <tr className="widgetLgTr">
            <th className="widgetLgTh">Customer</th>
            <th className="widgetLgTh">Date</th>
            <th className="widgetLgTh">Amount</th>
            <th className="widgetLgTh">Status</th>
          </tr>

          <tr className="widgetLgTr">
            <td className="widgetLgUser">
              <img src="https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" className="widgetLgImg" />
              <span className="widgetLgName">Nivethan</span>
            </td>
            <td className="widgetLgDate">2 Jun 2024</td>
            <td className="widgetLgAmount">Rs.14,500</td>
            <td className="widgetLgStatus"><Button type="Approved" /></td>
          </tr>

          <tr className="widgetLgTr">
            <td className="widgetLgUser">
              <img src="https://images.pexels.com/photos/4491476/pexels-photo-4491476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" className="widgetLgImg" />
              <span className="widgetLgName">Akila</span>
            </td>
            <td className="widgetLgDate">2 Jun 2024</td>
            <td className="widgetLgAmount">Rs.1,500</td>
            <td className="widgetLgStatus"><Button type="Declined" /></td>
          </tr>

          <tr className="widgetLgTr">
            <td className="widgetLgUser">
              <img src="https://images.pexels.com/photos/5717512/pexels-photo-5717512.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" className="widgetLgImg" />
              <span className="widgetLgName">Abisha</span>
            </td>
            <td className="widgetLgDate">2 Jun 2024</td>
            <td className="widgetLgAmount">Rs.4,500</td>
            <td className="widgetLgStatus"><Button type="Pending" /></td>
          </tr>

          <tr className="widgetLgTr">
            <td className="widgetLgUser">
              <img src="https://images.pexels.com/photos/789822/pexels-photo-789822.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" className="widgetLgImg" />
              <span className="widgetLgName">Elavanya</span>
            </td>
            <td className="widgetLgDate">2 Jun 2024</td>
            <td className="widgetLgAmount">Rs.9800</td>
            <td className="widgetLgStatus"><Button type="Approved" /></td>
          </tr>

          <tr className="widgetLgTr">
            <td className="widgetLgUser">
              <img src="https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" className="widgetLgImg" />
              <span className="widgetLgName">Abiram</span>
            </td>
            <td className="widgetLgDate">2 Jun 2024</td>
            <td className="widgetLgAmount">Rs.6,000</td>
            <td className="widgetLgStatus"><Button type="Approved" /></td>
          </tr>

        </table>
    </div>
  )
}
