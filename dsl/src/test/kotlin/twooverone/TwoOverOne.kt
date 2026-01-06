package twooverone

import com.github.phisgr.bridge.BiddingSystem
import com.github.phisgr.bridge.writeHtml
import java.io.File

/**
 * 二蓋一進局體系 (2/1 Game Force System)
 * 基於 Max Hardy 的二蓋一體系
 */
val twoOverOneSystem = BiddingSystem {
    name = "二蓋一進局體系"
    author = "Max Hardy (adapted)"
    description = """
        二蓋一進局體系（2/1 Game Force）是美國標準叫牌法的變體。

        ## 主要特點
        - 二蓋一應叫逼叫成局
        - 1NT 開叫 16-18 HCP
        - 5張高花開叫
        - 逼叫性 1NT 應叫

        ## 約定叫
        - Stayman / Jacoby Transfer / Texas Transfer
        - Inverted Minors (反常低花加叫)
        - Drury (德魯利)
        - Lebensohl
        - RKC Blackwood / Gerber
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
    "1N" - "均衡型，16-18點" {
        oneNoTrump()
    }

    // 2C 開叫 (強逼叫)
    "2C" - "強牌，23+均衡或8+贏墩" {
        twoClubStrong()
    }

    // 2D 開叫 (三色套)
    "2D" - "三色套4-4-4-1或4-4-5-0，10-13點" {
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
    "2N" - "均衡型，21-22點" {
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
    "3N" - "8張不連張低花套" {
        threeNoTrump()
    }

    // 4C/4D Namyats
    "4C" - "Namyats：好的H套，8贏墩" {
        namyatsHeart()
    }
    "4D" - "Namyats：好的S套，8贏墩" {
        namyatsSpade()
    }

    // 4H/4S 阻擊
    "4H" - "阻擊，8張H"
    "4S" - "阻擊，8張S"
}

fun main() {
    twoOverOneSystem.writeHtml(File("2over1.html"))
    println("Generated 2over1.html")
}
