import "./featuredInfo.css"
import { ArrowDownward, ArrowUpward } from "@mui/icons-material"

export default function FeaturedInfo() {
  return (
    <div class="featured">
        <div className="featuredItem">
            <span className="featuredTitle">Revenue</span>
            <div className="featuredMoneyContainer">
            <span className="featuredMoney">Rs.2,000,415</span>
            <span className="featureMoneyRate">-11.4<ArrowDownward className="featuredIcon negative"/></span>
        </div>
        <span className="featuredSub">Compared to last month</span>
        </div>

        <div className="featuredItem">
            <span className="featuredTitle">Cost</span>
            <div className="featuredMoneyContainer">
            <span className="featuredMoney">Rs. 700,800</span>
            <span className="featureMoneyRate">+2.76<ArrowDownward className="featuredIcon negative"/></span>
        </div>
        <span className="featuredSub">Compared to last month</span>
        </div>

        <div className="featuredItem">
            <span className="featuredTitle">Profit</span>
            <div className="featuredMoneyContainer">
            <span className="featuredMoney">Rs. 1.400,415</span>
            <span className="featureMoneyRate">-1.48<ArrowUpward className="featuredIcon"/></span>
        </div>
        <span className="featuredSub">Compared to last month</span>
        </div>
    </div>
  )
}
