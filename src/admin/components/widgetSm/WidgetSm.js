import "./widgetSm.css";
import { Visibility } from "@mui/icons-material";

export default function WidgetSm() {
  const members = [
    { name: "TM Raja", job: "Software Engineer", image: "https://images.pexels.com/photos/775091/pexels-photo-775091.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { name: "Kumara", job: "Data Analyst", image: "https://images.pexels.com/photos/50855/pexels-photo-50855.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { name: "Perera", job: "Product Manager", image: "https://images.pexels.com/photos/3760613/pexels-photo-3760613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { name: "Vikram", job: "Designer", image: "https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { name: "Prabu", job: "DevOps Engineer", image: "https://images.pexels.com/photos/793253/pexels-photo-793253.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" }
  ];

  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Join Customers</span>
      <ul className="widgetSmList">
        {members.map((member, index) => (
          <li key={index} className="widgetSmListItem">
            <img
              src={member.image}
              alt={member.name}
              className="widgetSmImg"
            />
            <div className="widgetSmUser">
              <span className="widgetSmUserName">{member.name}</span>
              <span className="widgetSmUserTitle">{member.job}</span>
            </div>
            <button className="widgetSmbutton">
              <Visibility className="widgetSmIcon" />
              Display
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
