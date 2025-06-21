# 그래프 분석

그래프 분석은 Obsidian에 **분석 뷰**를 추가하여 볼트 내 노트들 간의 유용한 관계를 계산하는 알고리즘 세트를 구현합니다! 저희의 대표 알고리즘은 _2차 백링크 패널_로 설명되는 **동시인용** 패널입니다.

그래프 분석 뷰는 노트 이름과 숫자로 구성된 테이블을 보여주며, 각 숫자는 현재 노트와 관련하여 해당 노트에 대한 그래프 분석 알고리즘의 값을 나타냅니다.

예시:

- `[[A]]는 [[B]]와 0.9 유사함`
- `[[A]]는 [[B]]와 연결될 확률이 0.6임`
- `[[A]]는 [[B]]와 6번 동시인용됨`

## 분석 유형

그래프 분석은 현재 4가지 분석 유형을 제공합니다:

1. 유사성
2. 링크 예측
3. 동시인용
4. 커뮤니티 탐지

각각은 서로 다른 목적을 가진 다양한 알고리즘을 구현합니다.

### 동시인용

동시인용은 두 노트가 같은 노트에서 함께 인용된 횟수를 계산하며, 두 노트가 가까이 인용될 때 추가 가중치를 부여합니다.

동시인용을 **2차 백링크** 패널로 생각해보세요: 무언가가 _어디서_ 인용되었는지 보여주는 대신, _왜_, 또는 _누구와_ 또는 _무엇과_ 함께 인용되었는지를 보여줍니다!

예를 들어, `[[C]]`의 내용에 `[[A]]와 [[B]]`가 있다면, `[[A]]`와 `[[B]]`는 각각 동시인용 수치가 1이 됩니다.

동시인용 > 0인 각 노트에는 드롭다운 메뉴가 제공됩니다. 각 드롭다운 내에서 어떤 노트가 이 두 노트를 동시인용하는지, 그리고 동시인용된 문장(같은 문장에 있는 경우)을 볼 수 있으며, 그렇지 않으면 다른 링크가 있는 문장만 표시됩니다.

![](https://i.imgur.com/9yspOkN.png)

#### 일일 노트 사용 사례 예시

@HEmile이 제공한 유용한 예시:

> 저는 일일 노트를 많이 사용하여 일기를 쓰고 그날의 뉴스에 대해 기록합니다. 이로 인해 백링크 패널이 다소 단조로워집니다: 어떤 노트에 대해 언제 썼는지만 보여주기 때문입니다. 동시인용 알고리즘은 훨씬 더 많은 것을 보여줍니다! 예를 들어, `Joe Biden` 노트는 제가 보통 Biden에 대해 `Donald Trump`와 함께 쓴다는 것을 보여줍니다. 하지만 Joe Biden과 `China` 간의 관계에 대해 제가 무엇을 썼는지 알고 싶다면, 동시인용 패널을 보고 관계를 확장하여 그 이야기를 볼 수 있습니다!

![](https://i.imgur.com/udPkuV3.png)

#### 비디오 튜토리얼
이 비디오는 동시인용이 왜 그렇게 유용한지에 대한 더 길고 심층적인 개요를 제공합니다!
[![비디오 보기](https://yt-embed.herokuapp.com/embed?v=rK6JVDrGERA)](https://youtu.be/rK6JVDrGERA)

### 유사성

유사성은 그래프에서의 연결성을 기반으로 두 노트가 얼마나 유사한지를 측정합니다(즉, 노트 내용은 고려되지 않음). 현재는 Jaccard 유사성 측정만 구현되어 있습니다.

#### Jaccard 유사성

**공식**:

![image](https://user-images.githubusercontent.com/70717676/139872572-93504295-6d29-4722-bdb1-3fbeb7bc22ec.png)

[출처](https://neo4j.com/docs/graph-data-science/current/alpha-algorithms/jaccard/#alpha-algorithms-similarity-jaccard-context)

여기서

- `|x|`는 노드 `x`가 가진 이웃의 수입니다(들어오거나 나가는 링크).
- `|x & y|`는 `x`와 `y`가 공통으로 가진 이웃의 수입니다

### 링크 예측

링크 예측은 그래프에서 다른 연결을 기반으로 두 노트가 연결되어야 할 확률을 측정합니다. 구현된 링크 예측 알고리즘은 Adamic Adar와 공통 이웃입니다.

#### Adamic Adar

**공식**:

![image](https://user-images.githubusercontent.com/70717676/139873180-c870e072-843c-42a9-83fc-87205b408754.png)

[출처](https://neo4j.com/docs/graph-data-science/current/alpha-algorithms/adamic-adar/)

여기서:

- `N(x)`는 `x`의 이웃 수입니다

#### 공통 이웃

**공식**:

![image](https://user-images.githubusercontent.com/70717676/139873406-d0542335-3b8c-4d08-8a5b-4510408ebd4e.png)

[출처](https://neo4j.com/docs/graph-data-science/current/alpha-algorithms/common-neighbors/)

여기서:

- `N(x)`는 `x`의 이웃 수입니다

### 커뮤니티 탐지

이 알고리즘들은 유사한 노트들의 그룹을 찾으려고 시도합니다.

#### 라벨 전파

각 노드에 고유한 라벨(자신의 이름)을 부여하는 것으로 시작합니다. 그런 다음 각 노드의 이웃을 살펴보고, 이웃들 중 가장 일반적인 라벨로 자신의 라벨을 변경합니다.
이 과정을 `반복` 횟수만큼 반복합니다.

마지막에는 노드들이 마지막으로 가진 라벨별로 그룹화되어 표시됩니다.

#### 클러스터링 계수

`u`가 속한 _삼각형_의 수와 속할 수 _있었던_ 삼각형의 수의 비율을 제공합니다:

![image](https://user-images.githubusercontent.com/70717676/140610147-0a05201f-d9c7-4c0c-b423-6bbeeb81253b.png)

## 유틸리티 클래스

그래프 분석 테이블(또는 동시인용 드롭다운)의 각 행에는 클래스가 있습니다:
`analysis-linked` 또는 `analysis-not-linked`로, 현재 노트가 해당 행의 노트와 연결되어 있는지를 나타냅니다. 이를 통해 연결성에 따라 테이블 행을 스타일링할 수 있습니다.

예를 들어, 연결된 노트의 투명도를 낮출 수 있습니다:

```css
tr.analysis-linked {
  opacity: 0.3;
}
```

![image](https://user-images.githubusercontent.com/70717676/139862955-75284ff5-0ced-4548-bf6e-caa353a16fe0.png)

연결된 행을 완전히 숨기는 것도 가능합니다:

```css
tr.analysis-linked {
  display: none;
}
```

## 설정

분석 뷰에서 다양한 `분석 유형`과 해당 유형 내의 다양한 `알고리즘` 중에서 선택할 수 있습니다. 플러그인 설정에서 기본 분석 유형을 설정할 수 있습니다.

`무한대`와 `0` 값을 숨기는 옵션도 있습니다.

![image](https://user-images.githubusercontent.com/70717676/138652879-d8b0e4a7-d70a-44e8-ba3c-67e04f6a8edd.png)

## 알고리즘 문서

구현된 알고리즘에 대해 더 자세히 읽거나 추가하고 싶은 알고리즘을 알려주시려면
[여기](https://neo4j.com/docs/graph-data-science/current/algorithms/)를 참조하세요 👀.
동시인용에 대한 정보는 대부분 [위키피디아](https://en.wikipedia.org/wiki/Co-citation)에서 찾을 수 있습니다. 특히, 저희는
[동시인용 근접성 분석](https://en.wikipedia.org/wiki/Co-citation_Proximity_Analysis)의 변형을 구현합니다.


## 커피 한 잔 사주기

SkepticMystic: [![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/G2G454TZF)

Emile: [![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/Emile)
