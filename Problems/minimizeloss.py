no_of_years=int(input())
prices=list(map(int,input().split()))

buy_year=-1
sell_year=-1
loss=2**31-1

for buy in range(len(prices)):
    for sell in range(buy+1 ,len(prices)):
        if(buy!=sell):
            curloss=prices[buy]-prices[sell]
            if(curloss>0 and curloss<loss):
                loss=curloss
                print(loss)
                buy_year=buy+1
                sell_year=sell+1
print(buy_year,sell_year,loss)
