from queue import Queue

waiters = [1,2,3,4]
q = Queue()
print([q.put(i) for i in waiters])
print(q)