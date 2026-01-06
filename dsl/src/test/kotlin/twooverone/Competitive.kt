package twooverone

import com.github.phisgr.bridge.BiddingSystem
import com.github.phisgr.bridge.BiddingTree
import com.github.phisgr.bridge.Bidder.*

/**
 * 競叫系統 (Competitive Bidding)
 * 包含：花色蓋叫、跳蓋叫、無將蓋叫、非正常無將、技術性賭倍、扣叫等
 */

/**
 * 將競叫規則添加到系統說明
 */
fun BiddingSystem.addCompetitiveBidding() {
    // 競叫系統添加到系統說明中
    description += """

## 競叫方法

### 蓋叫
- 花色蓋叫：7-15點，5+張排組
- 跳蓋叫：阻擊性，類似弱二/三開叫
- 1NT蓋叫：15-18點均衡型，有開叫花色止張
- 非正常無將(2NT/4NT/5NT)：兩個最低級未叫花色排組，5-5以上
- 技術性賭倍：對未叫花色有支持或16+點
- 米切爾扣叫：扣叫低花=雙高花5-4以上

### 對蓋叫的應叫
- 簡單加叫：4-9點，3+張支持
- 跳加叫：4-6點，4+張支持，阻擊性
- 跳扣叫：9-12點，有限加叫
- 單扣叫：12+點，迫叫
- 跳叫新花色：9-12點，好6張排組，邀叫

### 負賭倍
- 同伴開叫對方蓋叫後使用
- 表示未叫高花4+張，7-11點典型
- 牌力無上限

### 支持性賭倍
- 對方蓋叫後，賭倍=3張應叫花色支持
- 簡單加叫=4張支持

### 萊朋梭爾
- 賭倍弱二後，三副應叫=7+點
- 2NT接力=弱牌，要求叫3C
"""
}

/**
 * 對對方1階高花開叫的防守叫牌
 */
fun BiddingTree.defenseToOneMajor() {
    // 技術性賭倍
    "X" - "技術性賭倍：對未叫花色有支持或16+點" {
        takeoutDoubleResponses()
    }

    // 1NT蓋叫
    "1N" - "15-18點均衡型，有開叫花色止張" {
        noTrumpOvercallResponses()
    }

    // 簡單蓋叫
    remark(W, "簡單蓋叫：7-15點，5+張排組")

    // 跳蓋叫
    remark(W, "跳蓋叫：阻擊性，6-7張排組")

    // 2NT非正常無將
    "2N" - "非正常無將：兩最低級未叫排組，5-5以上" {
        "3C" - "選擇C"
        "3D" - "選擇D"
    }

    // 米切爾扣叫
    remark(W, "扣叫對方花色：另一高花+某低花，5-4以上")
}

/**
 * 對對方1階低花開叫的防守叫牌
 */
fun BiddingTree.defenseToOneMinor() {
    // 技術性賭倍
    "X" - "技術性賭倍：雙高花4-3以上或16+點" {
        takeoutDoubleResponses()
    }

    // 1NT蓋叫
    "1N" - "15-18點均衡型，有開叫花色止張" {
        noTrumpOvercallResponses()
    }

    // 簡單蓋叫
    remark(W, "簡單蓋叫：7-15點，5+張排組")

    // 跳蓋叫
    remark(W, "跳蓋叫：阻擊性")

    // 米切爾扣叫
    "2C" - "米切爾扣叫：雙高花5-4以上（對1C開叫）" {
        michaelsResponses()
    }
    "2D" - "米切爾扣叫：雙高花5-4以上（對1D開叫）" {
        michaelsResponses()
    }
}

/**
 * 技術性賭倍的應叫
 */
private fun BiddingTree.takeoutDoubleResponses() {
    "Pass" - "懲罰性不叫：對方花色很強"

    remark(E, "最經濟花色：0-8點，4+張")
    remark(E, "跳叫花色：9-11點，5+張排組")

    "1N" - "7-10點，有對方花色止張"
    "2N" - "11-12點，邀叫，有對方花色止張"

    remark(E, "扣叫對方花色：12+點，迫叫進局")
}

/**
 * 1NT蓋叫的應叫
 */
private fun BiddingTree.noTrumpOvercallResponses() {
    "2C" - "司臺曼"
    "2D" - "轉移叫到H"
    "2H" - "轉移叫到S"
    "2S" - "低花司臺曼"
    "2N" - "邀叫"
    "3N" - "止叫"

    remark(E, "轉移到對方開叫花色可問止張")
}

/**
 * 米切爾扣叫的應叫
 */
private fun BiddingTree.michaelsResponses() {
    "2H" - "選擇H"
    "2S" - "選擇S"
    "2N" - "問低花排組" {
        "3C" - "C排組"
        "3D" - "D排組"
    }
    "3H" - "邀叫，H排組"
    "3S" - "邀叫，S排組"
    "4H" - "止叫"
    "4S" - "止叫"
}

/**
 * 對對方技術性賭倍的應叫
 */
fun BiddingTree.afterOpponentTakeoutDouble() {
    "XX" - "再賭倍：9+點，傾向防守"

    remark(E, "簡單加叫：牌力可降低，高花3張支持即可")
    remark(E, "跳加叫：7-9點，4+張支持，阻擊性")

    "2N" - "好的有限加叫"

    remark(E, "跳叫新花色：阻擊性")
    remark(E, "一副新花色：迫叫，尋求配合")
    remark(E, "二副新花色：非迫叫，5+張排組")
}

/**
 * 同伴開叫對方蓋叫後的負賭倍
 */
fun BiddingTree.negativeDouble() {
    "X" - "負賭倍：未叫高花4+張，或低花長排組" {
        remark(E, "7-11點典型範圍，牌力無上限")
        remark(E, "可能有5-6張未叫高花但牌力不足自由叫")
    }
}

/**
 * 對弱二開叫的萊朋梭爾
 */
fun BiddingTree.lebensohl2() {
    "X" - "技術性賭倍" {
        remark(E, "跳叫進局：有成局牌力")
        remark(E, "三副應叫：7+點，非成局")

        "2N" - "萊朋梭爾：弱牌要求叫3C" {
            "3C" - "接力" {
                "Pass" - "C排組弱牌"
                "3D" - "D排組弱牌"
                "3H" - "H排組弱牌"
                "3S" - "S排組弱牌"
            }
        }
    }
}
