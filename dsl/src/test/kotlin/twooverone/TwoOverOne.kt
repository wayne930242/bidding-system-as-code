package twooverone

import com.github.phisgr.bridge.BiddingSystem
import com.github.phisgr.bridge.writeTo
import java.io.File

/**
 * 二蓋一進局體系 (2/1 Game Force System)
 * 基於 Max Hardy 的二蓋一體系
 */
val twoOverOneSystem = BiddingSystem {
    name = "二蓋一進局體系"
    author = "Max Hardy (adapted)"
    description = """
        二蓋一進局體系（2/1 Game Force）是當代最流行的自然叫牌體系之一，由 Max Hardy 在其著作中系統化整理。本系統基於 Hardy 風格，強調分配展示而非精確牌力定義。

        ## 核心原則
        - **二蓋一應叫迫叫進局**：開叫 1♦/♥/♠ 後，二線新花色應叫迫叫成局
        - **迫叫性 1NT**：開叫 1♥/♠ 後，1NT 應叫為迫叫一輪（5-12 點）
        - **五張高花開叫**：1♥/♠ 開叫保證 5 張以上
        - **強無將**：1NT 開叫 16-18 點

        ## 開叫結構
        - 1♣：3+ 張（3-3 低花開叫 1♣），12-21 點
        - 1♦：4+ 張（4-4-3-2 可開叫 3 張 D），12-21 點
        - 1♥/♠：5+ 張，12-21 點
        - 1NT：16-18 點平均牌型
        - 2♣：強迫叫（23+ 均衡或 8+ 贏墩）
        - 2♦：三色牌組（4-4-4-1 或 4-4-5-0），10-13 點
        - 2♥/♠：弱二（6 張，5-11 點）
        - 2NT：21-22 點平均牌型
        - 3X：阻擊開叫
        - 3NT：賭博性無將（8 張不連張低花）
        - 4♣/♦：Namyats（好的高花牌組，8 贏墩）

        ## 約定叫
        - Stayman / Jacoby 轉移叫 / Texas 轉移叫
        - Puppet Stayman（2NT 開叫後）
        - Minor Suit Stayman（低花 Stayman）
        - 反常低花加叫（Inverted Minors）
        - Schreiber 迫叫進局跳叫
        - Swiss 加叫
        - Mathe 問叫
        - Lebensohl（1NT 被蓋叫後）
        - RKC Blackwood / Gerber
        - Splinter 跳叫
        - Namyats
        - Ogust（弱二後）

        ## 防守叫牌
        - 技術性賭倍 / 負性賭倍 / 支持性賭倍
        - 簡單蓋叫 / 跳蓋叫
        - 1NT 蓋叫（15-18 點有止張）
        - Unusual 2NT / Michaels 扣叫
        - DONT（對強 1NT）
    """.trimIndent()

    // 1C 開叫
    "1C" - "C至少3張，12-21點" {
        oneClub()
    }

    // 1D 開叫
    "1D" - "D至少4張（除非4-4-3-2），12-21點" {
        oneDiamond()
    }

    // 1H 開叫
    "1H" - "5+H，12-21點" {
        oneHeart()
    }

    // 1S 開叫
    "1S" - "5+S，12-21點" {
        oneSpade()
    }

    // 1NT 開叫
    "1N" - "平均牌型，16-18點" {
        oneNoTrump()
    }

    // 2C 開叫 (強迫叫)
    "2C" - "強牌，23+均衡或8+贏墩" {
        twoClubStrong()
    }

    // 2D 開叫 (三色牌組)
    "2D" - "三色牌組4-4-4-1或4-4-5-0，10-13點" {
        twoDiamondMulti()
    }

    // 2H 弱二開叫
    "2H" - "弱二，6張H，5-11點" {
        weakTwoHeart()
    }

    // 2S 弱二開叫
    "2S" - "弱二，6張S，5-11點" {
        weakTwoSpade()
    }

    // 2NT 開叫
    "2N" - "平均牌型，21-22點" {
        twoNoTrump()
    }

    // 三副阻擊開叫
    "3C" - "阻擊，7張C" {
        threeLevel()
    }
    "3D" - "阻擊，7張D" {
        threeLevel()
    }
    "3H" - "阻擊，7張H" {
        threeLevel()
    }
    "3S" - "阻擊，7張S" {
        threeLevel()
    }

    // 3NT 開叫 (Gambling)
    "3N" - "8張不連張低花牌組" {
        threeNoTrump()
    }

    // 4C/4D Namyats
    "4C" - "Namyats：好的H牌組，8贏墩" {
        namyatsHeart()
    }
    "4D" - "Namyats：好的S牌組，8贏墩" {
        namyatsSpade()
    }

    // 4H/4S 阻擊
    "4H" - "阻擊，8張H"
    "4S" - "阻擊，8張S"

    // 競叫系統
    addCompetitiveBidding()
}

fun main() {
    File("build").mkdirs()
    val jsonFile = File("build", "2over1.json")
    twoOverOneSystem.writeTo(jsonFile)
    println("Written JSON to ${jsonFile.absolutePath}")
}
